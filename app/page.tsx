"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import Badge from "@/components/Badge";
import PriceAuditDemo from "@/components/PriceAuditDemo";

const METRIC_KEY = "ds_metrics_v1";

type Metrics = { views: number; ctaClicks: number; emailSubmits: number; last?: string | null };
const defaultMetrics: Metrics = { views: 0, ctaClicks: 0, emailSubmits: 0, last: null };

function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>(defaultMetrics);
  useEffect(() => {
    // load
    try {
      const saved = JSON.parse(localStorage.getItem(METRIC_KEY) || "null");
      if (saved) setMetrics(saved);
    } catch {}
    // view +1
    setMetrics((prev) => {
      const next = { ...prev, views: prev.views + 1, last: new Date().toISOString() };
      localStorage.setItem(METRIC_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const record = (k: keyof Metrics) =>
    setMetrics((prev) => {
      const next = { ...prev, [k]: ((prev as any)[k] || 0) + 1, last: new Date().toISOString() };
      localStorage.setItem(METRIC_KEY, JSON.stringify(next));
      return next;
    });

  const reset = () => {
    localStorage.setItem(METRIC_KEY, JSON.stringify(defaultMetrics));
    setMetrics(defaultMetrics);
  };

  return { metrics, record, reset };
}

export default function Page() {
  const { metrics, record, reset } = useMetrics();

  const [product, setProduct] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(true);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"loading" | "gate" | "done">("loading");

  const utm = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const obj: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
      const v = params.get(k);
      if (v) obj[k] = v;
    });
    obj["referrer"] = document.referrer || "";
    return obj;
  }, []);

  const handleCheckClick = () => {
    record("ctaClicks");
    setOpen(true);
    setPhase("loading");
    setTimeout(() => setPhase("gate"), 1200);
    // (선택) Plausible/GA 이벤트 연결
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("이메일 형식이 올바르지 않습니다.");
    if (!agree) return alert("약관에 동의해 주세요.");
    record("emailSubmits");
    setPhase("done");

    // 서버 수집 (옵션)
    try {
      await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product, utm, ts: Date.now() }),
      });
    } catch {}
  };

  return (
    <main>
      {/* NAV */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-black text-white">당</div>
          <span className="text-lg font-semibold">당하기 싫은 사람들의 모임</span>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <a className="text-sm text-gray-600 hover:text-black" href="#examples">
            예시
          </a>
          <a className="text-sm text-gray-600 hover:text-black" href="#features">
            기능
          </a>
          <a className="text-sm text-gray-600 hover:text-black" href="#price-audit">
            가격감사
          </a>
          <a className="text-sm text-gray-600 hover:text-black" href="#how">
            동작방식
          </a>
          <button
            onClick={reset}
            className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50"
          >
            지표리셋
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 sm:grid-cols-2">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
            이 상품, <span className="bg-black px-2 text-white">과장광고</span>일까요?
          </h1>
          <p className="mt-4 max-w-prose text-gray-600">
            상품 URL이나 이름을 붙여넣고 <strong>판별하기</strong>를 눌러보세요.
            성분·광고문구·판매처 정보를 기반으로 위험도를 알려드립니다.
          </p>
          <div className="mt-6 flex w-full max-w-xl items-center gap-2">
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="상품 URL 또는 이름 붙여넣기"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none ring-black/10 focus:ring"
            />
            <button
              onClick={handleCheckClick}
              className="whitespace-nowrap rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-90"
            >
              판별하기
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            * 베타 시범 서비스 — 정확도 향상을 위해 사용 데이터가 익명 수집될 수 있습니다.
          </div>

          {/* Mini metrics */}
          <div className="mt-6 grid max-w-xl grid-cols-3 gap-2 text-center">
            {[
              { k: "views", t: "페이지 뷰", v: metrics.views },
              { k: "ctaClicks", t: "CTA 클릭", v: metrics.ctaClicks },
              { k: "emailSubmits", t: "이메일 등록", v: metrics.emailSubmits },
            ].map((it) => (
              <div key={it.k} className="rounded-xl border bg-white p-3 text-xs">
                <div className="text-[11px] text-gray-500">{it.t}</div>
                <div className="text-lg font-bold">{it.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 샘플 인사이트 박스 */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold">실시간 인기 의심 신호</div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {["무근거 1위 claim", "과장 Before/After", "의학적 효능 단정"].map((t, i) => (
              <div key={i} className="rounded-xl border bg-gray-50 p-4 text-xs">
                {t}
              </div>
            ))}
          </div>
          <div className="mt-6 text-xs text-gray-500">
            * 샘플 데이터. 실제 분석은 준비 중입니다.
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section id="examples" className="mx-auto w-full max-w-6xl px-4 pb-8">
        <h2 className="text-xl font-bold">과장광고 의심 예시 5가지</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 1. 리뷰 수 조작 */}
          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Badge>심각도: 높음</Badge>
              <Badge>패턴: 조작/미스리딩</Badge>
            </div>
            <h3 className="mt-2 text-sm font-semibold">1) 리뷰 수 조작</h3>
            <p className="mt-1 text-sm text-gray-600">
              비정상적 평점 분포·리뷰봇 패턴(짧은 반복문장, 생성시각 클러스터 등)
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border">
              <Image
                src="/examples/ex1-review.svg"
                alt="리뷰 조작 예시"
                width={1200}
                height={250}
              />
            </div>
          </article>

          {/* 2. 로션 성분인데 임상/전용 크림처럼 포장 */}
          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Badge>심각도: 중간</Badge>
              <Badge>패턴: 오인 유도</Badge>
            </div>
            <h3 className="mt-2 text-sm font-semibold">2) 로션 성분을 임상/전용 크림처럼 포장</h3>
            <p className="mt-1 text-sm text-gray-600">
              제품 카테고리 대비 과도한 효능 암시(전용·의학적 뉘앙스, 문구/비주얼 불일치)
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border">
              <Image
                src="/examples/ex2-clinical-copy.svg"
                alt="임상 연관 과장 예시"
                width={1200}
                height={680}
              />
            </div>
          </article>

          {/* 3. 임상 시험 수치 미인증 */}
          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Badge>심각도: 높음</Badge>
              <Badge>패턴: 수치 오용</Badge>
            </div>
            <h3 className="mt-2 text-sm font-semibold">3) 임상 시험 수치 미인증</h3>
            <p className="mt-1 text-sm text-gray-600">
              검증 불가한 출처/표본·p-value/context 누락, 유의성 표기 남용
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border">
              <Image
                src="/examples/ex3-claim-chart.svg"
                alt="임상 수치 미인증 예시"
                width={1080}
                height={720}
              />
            </div>
          </article>

          {/* 4. 보정된 Before/After */}
          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Badge>심각도: 높음</Badge>
              <Badge>패턴: 이미지 보정</Badge>
            </div>
            <h3 className="mt-2 text-sm font-semibold">4) 보정으로 만든 효과</h3>
            <p className="mt-1 text-sm text-gray-600">
              조명/각도/메이크업/포즈 차이로 개선처럼 보이게 하는 전형
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border">
              <Image
                src="/examples/ex4-before-after.svg"
                alt="보정된 비포애프터 예시"
                width={920}
                height={900}
              />
            </div>
          </article>

          {/* 5. AI 생성 전문가 사칭 */}
          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Badge>심각도: 중간~높음</Badge>
              <Badge>패턴: AI/딥페이크</Badge>
            </div>
            <h3 className="mt-2 text-sm font-semibold">5) AI가 만든 전문가/사용자 후기 영상</h3>
            <p className="mt-1 text-sm text-gray-600">
              합성 음성·아바타·과도하게 또렷한 피부/치아 등 비현실적 디테일
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border">
              <Image
                src="/examples/ex5-ai-video.svg"
                alt="AI 전문가 사칭 썸네일"
                width={960}
                height={540}
              />
            </div>
          </article>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="text-xl font-bold">무엇을 봐주나요?</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { t: "광고 문구", d: "의학적 표현·극단적 수치·근거 불분명 문구 자동 점검" },
            { t: "성분", d: "전성분 대비 과대 포장 가능성, 함량 대비 표현 비율" },
            { t: "판매처", d: "브랜드 신뢰도·리뷰 패턴·반품/CS 이슈" },
          ].map((it, idx) => (
            <div key={idx} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold">{it.t}</div>
              <div className="mt-2 text-sm text-gray-600">{it.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICE AUDIT */}
      <section id="price-audit" className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="text-xl font-bold mb-2">🔍 실시간 가격 감사</h2>
        <p className="text-gray-600 mb-6">
          원가 뻥튀기 후 할인 바이럴 패턴을 AI로 탐지합니다. 의심스러운 상품의 가격 정보를
          입력해보세요.
        </p>
        <PriceAuditDemo />
      </section>

      {/* HOW */}
      <section id="how" className="mx-auto w-full max-w-6xl px-4 pb-16">
        <h2 className="text-xl font-bold">어떻게 동작하나요?</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-gray-700">
          <li>
            상품 URL/이름을 입력하고 <strong>판별하기</strong> 클릭
          </li>
          <li>알파 테스터로 등록하면 가장 먼저 결과를 받아볼 수 있어요</li>
          <li>정식 론칭 시 개인화된 위험 리포트를 제공할 예정입니다</li>
        </ol>
      </section>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        {phase === "loading" && (
          <div>
            <div className="text-lg font-semibold">상품 신뢰도 분석 중…</div>
            <div className="mt-2 text-sm text-gray-600">
              광고 문구 · 성분 · 판매처 신뢰도를 살펴보고 있어요.
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-10/12 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/12 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        )}

        {phase === "gate" && (
          <div>
            <div className="text-lg font-semibold">알파 테스트 준비 중</div>
            <p className="mt-2 text-sm text-gray-600">
              지금은 초대 기반으로 테스트 중입니다. 이메일을 남겨주시면{" "}
              <strong>정식 오픈 시</strong> 가장 먼저 결과를 보내드릴게요.
            </p>
            <form onSubmit={handleEmailSubmit} className="mt-5 space-y-3">
              <div>
                <label className="text-xs text-gray-500">관심 상품</label>
                <input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="예: https://shop.example.com/product/123"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-black/10 focus:ring"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">이메일</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none ring-black/10 focus:ring"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                개인정보 수집 및 안내 메일 수신에 동의합니다.
              </label>
              <button
                type="submit"
                className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                대기자 등록
              </button>
              <div className="text-[11px] text-gray-400">
                * 제출 시점, 리퍼러/UTM, 입력값은 익명 처리되어 서비스 개선에 활용됩니다.
              </div>
            </form>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center">
            <div className="text-lg font-semibold">등록 완료!</div>
            <p className="mt-2 text-sm text-gray-600">
              정식 오픈 시 <span className="font-medium">{email}</span>로 먼저 알려드릴게요.
              감사합니다 🙌
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-6 rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
            >
              닫기
            </button>
          </div>
        )}
      </Modal>
    </main>
  );
}
