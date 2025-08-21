// lib/priceAudit.ts
// 정상 단가 추정, 할인율 계산, '원가 뻥튀기 후 할인' 의심 패턴 점수화

export type CompetitorPrice = {
  name: string; // 경쟁사 이름
  listPrice: number; // 경쟁사 표시가
  salePrice?: number; // 경쟁사 할인가(있으면)
};

export type HistoricalPrice = {
  ts: number; // UNIX ms
  listPrice: number;
  salePrice?: number;
  cost?: number; // 과거 원가(있으면)
};

export type PriceAuditInput = {
  currency: string; // "KRW" 등
  cost: number; // 신고된 원가(문제의 핵심)
  listPrice: number; // 소비자 표시가(정가)
  salePrice?: number; // 현재 판매가(할인가)
  shippingFee?: number; // 배송비(소비자 부담)
  platformFeeRate?: number; // 판매 수수료 비율(예: 0.1 = 10%)
  taxRate?: number; // 세율(예: 0.1 = 10%)
  competitors?: CompetitorPrice[];
  history?: HistoricalPrice[];
  normalMarginRange?: { min: number; max: number }; // 정상 마진 밴드(예: 0.2~0.5)
};

export type PriceAuditOutput = {
  baseline: {
    expectedListPrice: number; // 정상 정가 추정치
    expectedSalePrice: number; // 정상 할인가 추정치(경쟁/히스토리 반영)
  };
  metrics: {
    discountRate: number; // 표시가 대비 현재가 할인율 (0~1)
    listOverBaseline: number; // 표시가가 baseline 대비 얼마나 높은지 비율
    saleNearBaseline: number; // 현재 판매가가 baseline에 얼마나 근접한지(0~1, 1이면 거의 같음)
    competitorIndex: number; // 경쟁사 미디언 대비 우리 판매가 비율(1이면 동일)
    historicalInflationHint: number; // 과거 대비 원가/정가 급증 신호(0~1)
  };
  score: number; // 0~100 (높을수록 '뻥튀기 후 할인' 의심)
  flags: string[]; // 규칙 기반 플래그들
  explanation: string[]; // 사람이 읽을 수 있는 근거 문장
};

// 유틸
const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const pct = (n: number) => Math.round(n * 100);

/** 안전한 중앙값 */
function median(values: number[]): number {
  if (!values.length) return NaN;
  const arr = [...values].sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

/** 정상 정가(baseline) 추정: 원가 + (수수료/세금/배송) + 정상 마진 밴드 중앙값 */
export function estimateExpectedListPrice(input: PriceAuditInput) {
  const {
    cost,
    shippingFee = 0,
    platformFeeRate = 0.1,
    taxRate = 0.1,
    normalMarginRange = { min: 0.2, max: 0.5 },
  } = input;

  const midMargin = (normalMarginRange.min + normalMarginRange.max) / 2; // 중앙 마진
  const base = cost * (1 + midMargin);
  const withFee = base * (1 + platformFeeRate);
  const withTax = withFee * (1 + taxRate);
  return withTax + shippingFee;
}

/** 경쟁/히스토리 반영 정상 '판매가' 추정: 경쟁사 미디언과 과거 실판매를 블렌딩 */
export function estimateExpectedSalePrice(input: PriceAuditInput, expectedListPrice: number) {
  const compPrices = (input.competitors || [])
    .map((c) => c.salePrice ?? c.listPrice)
    .filter((n) => Number.isFinite(n) && n > 0);
  const compMedian = compPrices.length ? median(compPrices) : NaN;

  const histSales = (input.history || [])
    .map((h) => h.salePrice ?? h.listPrice)
    .filter((n) => Number.isFinite(n) && n > 0);
  const histMedian = histSales.length ? median(histSales) : NaN;

  // 기본은 정가 대비 10~20% 합리 할인 가정
  const fallback = expectedListPrice * 0.88;

  const candidates = [compMedian, histMedian, fallback].filter((n) =>
    Number.isFinite(n)
  ) as number[];
  if (!candidates.length) return expectedListPrice; // 정보 없음 → 정가 기준
  return median(candidates);
}

export function discountRate(listPrice: number, salePrice?: number) {
  if (!salePrice || salePrice <= 0 || !listPrice || listPrice <= 0) return 0;
  return clamp((listPrice - salePrice) / listPrice, 0, 1);
}

/** 과거 대비 원가/정가 급증(인위적 인상) 힌트(0~1) */
export function historicalInflationHint(input: PriceAuditInput) {
  const hist = input.history || [];
  if (hist.length < 2) return 0;

  const recent = hist[hist.length - 1];
  const first = hist[0];

  const costJump =
    first.cost && input.cost ? clamp((input.cost - first.cost) / Math.max(first.cost, 1), 0, 1) : 0;

  const listJump = clamp((input.listPrice - first.listPrice) / Math.max(first.listPrice, 1), 0, 1);

  // 가중 평균: 원가 급증 60%, 정가 급증 40%
  return clamp(costJump * 0.6 + listJump * 0.4, 0, 1);
}

/**
 * 핵심: '원가를 높여 표시가를 부풀린 뒤, 정상가 근처로 할인' 패턴 탐지
 * 특징 조합:
 *  - 표시가(listPrice) >> baseline(expectedListPrice)  (부풀리기)
 *  - 현재가(salePrice) ≈ expectedSalePrice            (정상 수준으로 할인)
 *  - 할인율이 과도(예: 50%+)                           (바이럴 유도)
 *  - 경쟁사 미디언 대비 현재가가 비슷하거나 약간 낮음  (정상가처럼 보임)
 *  - 과거 원가/정가 급증 신호                          (사전 인상)
 */
export function auditPrice(input: PriceAuditInput): PriceAuditOutput {
  const expectedList = estimateExpectedListPrice(input);
  const expectedSale = estimateExpectedSalePrice(input, expectedList);

  const dr = discountRate(input.listPrice, input.salePrice);
  const listOverBaseline = clamp(input.listPrice / Math.max(expectedList, 1) - 1, 0, 2); // 0~(상한2)
  const saleNearBaseline = clamp(
    1 - Math.abs((input.salePrice ?? input.listPrice) - expectedSale) / Math.max(expectedSale, 1)
  );
  const compMedian = median(
    (input.competitors || [])
      .map((c) => c.salePrice ?? c.listPrice)
      .filter((n) => Number.isFinite(n) && n > 0) as number[]
  );
  const competitorIndex = Number.isFinite(compMedian)
    ? (input.salePrice ?? input.listPrice) / compMedian
    : 1;

  const histHint = historicalInflationHint(input);

  // 규칙 기반 플래그
  const flags: string[] = [];
  if (listOverBaseline > 0.3) flags.push("표시가가 정상 정가 추정치 대비 과도하게 높음");
  if (dr >= 0.5) flags.push("50% 이상 고할인 표시(바이럴 유도 가능성)");
  if (saleNearBaseline > 0.7) flags.push("현재 판매가가 정상 판매가 추정치에 근접");
  if (competitorIndex >= 0.9 && competitorIndex <= 1.1) flags.push("경쟁사 미디언과 현재가가 유사");
  if (histHint > 0.5) flags.push("과거 대비 원가/정가 급증 패턴");

  // 가중치 점수 (0~100)
  const score =
    clamp(listOverBaseline / 1.0, 0, 1) * 28 + // 표시가 과대
    clamp(dr, 0, 1) * 24 + // 과대 할인율
    clamp(saleNearBaseline, 0, 1) * 20 + // 현재가 정상가 근접
    clamp(1 - Math.abs(1 - competitorIndex), 0, 1) * 16 + // 경쟁사 미디언 근접
    clamp(histHint, 0, 1) * 12; // 사전 인상 힌트

  const explanation: string[] = [
    `정상 정가 추정치: ${Math.round(expectedList).toLocaleString()} ${input.currency}`,
    `정상 판매가 추정치: ${Math.round(expectedSale).toLocaleString()} ${input.currency}`,
    `현재 할인율: ${pct(dr)}%`,
    `표시가의 과대 비율(대비): ${pct(
      clamp(input.listPrice / Math.max(expectedList, 1) - 1, 0, 1)
    )}%`,
    Number.isFinite(compMedian)
      ? `경쟁사 미디언 대비 현재가 지수: ${competitorIndex.toFixed(2)}`
      : `경쟁사 비교 데이터 없음`,
    `히스토리 급증 신호: ${pct(histHint)}%`,
  ];

  return {
    baseline: {
      expectedListPrice: expectedList,
      expectedSalePrice: expectedSale,
    },
    metrics: {
      discountRate: dr,
      listOverBaseline,
      saleNearBaseline,
      competitorIndex,
      historicalInflationHint: histHint,
    },
    score: Math.round(score),
    flags,
    explanation,
  };
}
