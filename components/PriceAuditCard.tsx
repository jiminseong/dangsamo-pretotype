"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { PriceAuditOutput } from "@/lib/priceAudit";
import Badge from "./Badge";

interface PriceAuditCardProps {
  result: PriceAuditOutput;
  currency?: string;
}

function getRiskLevel(score: number): {
  level: string;
  variant: "default" | "danger" | "warning" | "success";
} {
  if (score >= 70) return { level: "매우 높음", variant: "danger" };
  if (score >= 50) return { level: "높음", variant: "warning" };
  if (score >= 30) return { level: "중간", variant: "warning" };
  return { level: "낮음", variant: "success" };
}

export default function PriceAuditCard({ result, currency = "KRW" }: PriceAuditCardProps) {
  const risk = getRiskLevel(result.score);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      // 카드 전체 등장 애니메이션
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
      );

      // 내부 요소들 순차 애니메이션
      gsap.fromTo(
        cardRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.4, delay: 0.2 }
      );
    }
  }, [result]);

  return (
    <div ref={cardRef} className="card p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">가격 감사 결과</h3>
        <Badge variant={risk.variant}>
          위험도: {risk.level} ({result.score}점)
        </Badge>
      </div>

      {/* 기준가 정보 */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-xl">
        <div>
          <div className="text-xs text-slate-500">정상 정가 추정</div>
          <div className="text-lg font-bold text-slate-900">
            {Math.round(result.baseline.expectedListPrice).toLocaleString()} {currency}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">정상 판매가 추정</div>
          <div className="text-lg font-bold text-slate-900">
            {Math.round(result.baseline.expectedSalePrice).toLocaleString()} {currency}
          </div>
        </div>
      </div>

      {/* 플래그 */}
      {result.flags.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2 text-slate-800">⚠️ 의심 신호</div>
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
          <span className="text-slate-500">할인율</span>
          <span className="font-medium text-slate-800">
            {Math.round(result.metrics.discountRate * 100)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">표시가 과대</span>
          <span className="font-medium text-slate-800">
            {Math.round(result.metrics.listOverBaseline * 100)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">경쟁가 지수</span>
          <span className="font-medium text-slate-800">
            {result.metrics.competitorIndex.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">급증 신호</span>
          <span className="font-medium text-slate-800">
            {Math.round(result.metrics.historicalInflationHint * 100)}%
          </span>
        </div>
      </div>

      {/* 설명 */}
      <details className="mt-4">
        <summary className="text-sm font-medium cursor-pointer text-slate-700 hover:text-slate-900">
          상세 분석 보기
        </summary>
        <div className="mt-2 space-y-1">
          {result.explanation.map((exp, index) => (
            <div key={index} className="text-xs text-slate-600">
              • {exp}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
