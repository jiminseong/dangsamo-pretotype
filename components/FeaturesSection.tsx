"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FeaturesSection() {
  const featureCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 기능 카드 스크롤 애니메이션
    if (featureCardsRef.current) {
      gsap.fromTo(
        featureCardsRef.current.querySelectorAll(".card"),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featureCardsRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <section id="features" className="section-padding bg-gray-50">
      <div className="container-max" ref={featureCardsRef}>
        <div className="text-center mb-20">
          <h2 className="heading-lg mb-6">🔍 무엇을 분석하나요?</h2>
          <p className="text-body-lg text-gray-600">AI가 다각도로 검증하는 항목들</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="card text-center group hover:scale-105 transition-transform">
            <div className="text-5xl mb-6">📝</div>
            <h3 className="heading-md mb-4">광고 문구</h3>
            <p className="text-body">
              의학적 표현, 극단적 수치, 근거 불분명 문구를 자동으로 점검하고 위험도를 평가합니다
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform">
            <div className="text-5xl mb-6">🧪</div>
            <h3 className="heading-md mb-4">성분 분석</h3>
            <p className="text-body">
              전성분 대비 과대 포장 가능성과 함량 대비 표현 비율을 정밀하게 분석합니다
            </p>
          </div>

          <div className="card text-center group hover:scale-105 transition-transform">
            <div className="text-5xl mb-6">🏪</div>
            <h3 className="heading-md mb-4">판매처 신뢰도</h3>
            <p className="text-body">
              브랜드 신뢰도, 리뷰 패턴, 반품/CS 이슈를 종합적으로 검토하여 판단합니다
            </p>
          </div>
        </div>

        <div className="text-center mt-20">
          <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-200 max-w-5xl mx-auto">
            <h3 className="heading-md mb-8">🎯 정확도 높은 AI 분석</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="stat-number">94.2%</div>
                <div className="text-base font-semibold text-gray-700">과장광고 탐지 정확도</div>
              </div>
              <div>
                <div className="stat-number">0.8초</div>
                <div className="text-base font-semibold text-gray-700">평균 분석 시간</div>
              </div>
              <div>
                <div className="stat-number">15만+</div>
                <div className="text-base font-semibold text-gray-700">학습된 사례 수</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
