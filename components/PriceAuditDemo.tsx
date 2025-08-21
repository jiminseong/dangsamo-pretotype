"use client";

import { useState } from "react";
import { PriceAuditInput, PriceAuditOutput } from "@/lib/priceAudit";
import PriceAuditCard from "./PriceAuditCard";
import Badge from "./Badge";

export default function PriceAuditDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PriceAuditOutput | null>(null);
  const [formData, setFormData] = useState<Partial<PriceAuditInput>>({
    currency: "KRW",
    cost: 12000,
    listPrice: 59000,
    salePrice: 19900,
    shippingFee: 3000,
    platformFeeRate: 0.1,
    taxRate: 0.1,
  });

  // 예시 데이터들
  const examples = [
    {
      name: "의심 사례: 원가 뻥튀기 후 할인",
      data: {
        currency: "KRW",
        cost: 12000,
        listPrice: 59000,
        salePrice: 19900,
        shippingFee: 3000,
        platformFeeRate: 0.1,
        taxRate: 0.1,
        competitors: [
          { name: "A몰", listPrice: 21900 },
          { name: "B몰", listPrice: 20900, salePrice: 19900 },
          { name: "C몰", listPrice: 22900 },
        ],
        history: [
          {
            ts: Date.now() - 1000 * 60 * 60 * 24 * 60,
            listPrice: 24900,
            salePrice: 19900,
            cost: 9000,
          },
          {
            ts: Date.now() - 1000 * 60 * 60 * 24 * 30,
            listPrice: 26900,
            salePrice: 19900,
            cost: 9500,
          },
        ],
      },
    },
    {
      name: "정상 사례: 합리적 가격",
      data: {
        currency: "KRW",
        cost: 15000,
        listPrice: 24900,
        salePrice: 22900,
        shippingFee: 3000,
        platformFeeRate: 0.1,
        taxRate: 0.1,
        competitors: [
          { name: "A몰", listPrice: 25900, salePrice: 23900 },
          { name: "B몰", listPrice: 24900, salePrice: 22900 },
          { name: "C몰", listPrice: 26900, salePrice: 24900 },
        ],
      },
    },
  ];

  const runAudit = async () => {
    if (!formData.cost || !formData.listPrice) {
      alert("원가와 표시가를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/price-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.ok) {
        setResult(data.result);
      } else {
        alert("오류: " + data.error);
      }
    } catch (error) {
      alert("API 호출 실패: " + error);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example: (typeof examples)[0]) => {
    setFormData(example.data);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* 예시 버튼들 */}
      <div className="flex gap-2 flex-wrap">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => loadExample(example)}
            className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            {example.name}
          </button>
        ))}
      </div>

      {/* 입력 폼 */}
      <div className="rounded-2xl border bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">가격 정보 입력</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">원가 (KRW)</label>
            <input
              type="number"
              value={formData.cost || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, cost: Number(e.target.value) }))}
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="12000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">표시가 (KRW)</label>
            <input
              type="number"
              value={formData.listPrice || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, listPrice: Number(e.target.value) }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="59000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">판매가 (KRW)</label>
            <input
              type="number"
              value={formData.salePrice || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, salePrice: Number(e.target.value) }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="19900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">배송비 (KRW)</label>
            <input
              type="number"
              value={formData.shippingFee || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shippingFee: Number(e.target.value) }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="3000"
            />
          </div>
        </div>

        <button
          onClick={runAudit}
          disabled={loading}
          className="mt-4 w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "분석 중..." : "가격 감사 실행"}
        </button>
      </div>

      {/* 결과 표시 */}
      {result && <PriceAuditCard result={result} currency="KRW" />}
    </div>
  );
}
