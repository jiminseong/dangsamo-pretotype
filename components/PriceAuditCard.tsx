import { PriceAuditOutput } from "@/lib/priceAudit";
import Badge from "./Badge";

interface PriceAuditCardProps {
  result: PriceAuditOutput;
  currency?: string;
}

function getRiskLevel(score: number): { level: string; color: string; bgColor: string } {
  if (score >= 70) return { level: "매우 높음", color: "text-red-800", bgColor: "bg-red-100" };
  if (score >= 50) return { level: "높음", color: "text-orange-800", bgColor: "bg-orange-100" };
  if (score >= 30) return { level: "중간", color: "text-yellow-800", bgColor: "bg-yellow-100" };
  return { level: "낮음", color: "text-green-800", bgColor: "bg-green-100" };
}

export default function PriceAuditCard({ result, currency = "KRW" }: PriceAuditCardProps) {
  const risk = getRiskLevel(result.score);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">가격 감사 결과</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${risk.bgColor} ${risk.color}`}>
          위험도: {risk.level} ({result.score}점)
        </div>
      </div>

      {/* 기준가 정보 */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
        <div>
          <div className="text-xs text-gray-500">정상 정가 추정</div>
          <div className="text-lg font-bold">
            {Math.round(result.baseline.expectedListPrice).toLocaleString()} {currency}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">정상 판매가 추정</div>
          <div className="text-lg font-bold">
            {Math.round(result.baseline.expectedSalePrice).toLocaleString()} {currency}
          </div>
        </div>
      </div>

      {/* 플래그 */}
      {result.flags.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">⚠️ 의심 신호</div>
          <div className="space-y-1">
            {result.flags.map((flag, index) => (
              <div
                key={index}
                className="text-sm text-orange-700 bg-orange-50 px-3 py-2 rounded-lg"
              >
                • {flag}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 상세 지표 */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">할인율</span>
          <span className="font-medium">{Math.round(result.metrics.discountRate * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">표시가 과대</span>
          <span className="font-medium">{Math.round(result.metrics.listOverBaseline * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">경쟁가 지수</span>
          <span className="font-medium">{result.metrics.competitorIndex.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">급증 신호</span>
          <span className="font-medium">
            {Math.round(result.metrics.historicalInflationHint * 100)}%
          </span>
        </div>
      </div>

      {/* 설명 */}
      <details className="mt-4">
        <summary className="text-sm font-medium cursor-pointer text-gray-700 hover:text-black">
          상세 분석 보기
        </summary>
        <div className="mt-2 space-y-1">
          {result.explanation.map((exp, index) => (
            <div key={index} className="text-xs text-gray-600">
              • {exp}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
