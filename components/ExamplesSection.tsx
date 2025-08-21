"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Badge from "./Badge";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExamplesSectionProps {
  onCheckClick: () => void;
}

export default function ExamplesSection({ onCheckClick }: ExamplesSectionProps) {
  const exampleCardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 예시 카드 스크롤 애니메이션
    if (exampleCardsRef.current) {
      gsap.fromTo(
        exampleCardsRef.current.querySelectorAll("article"),
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: exampleCardsRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <section id="examples" className="section-padding bg-white">
      <div className="container-max" ref={exampleCardsRef}>
        <div className="text-center mb-20">
          <h2 className="heading-lg mb-6">📋 실제 과장광고 사례</h2>
          <p className="text-body-lg text-gray-600">AI가 분석한 실제 문제 사례들을 확인해보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 예시 1: 리뷰 조작 */}
          <article className="card group hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="danger">심각도: 높음</Badge>
              <Badge variant="warning">패턴: 리뷰 조작</Badge>
            </div>
            <h3 className="heading-md mb-4">1) 리뷰 수 조작</h3>
            <p className="text-body mb-6">
              비정상적 평점 분포와 리뷰봇 패턴 (짧은 반복문장, 생성시각 클러스터)을 AI가 감지
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-gray-700">AI 분석 결과</span>
                <span className="text-red-600 font-bold text-lg">위험도: 85%</span>
              </div>
            </div>
          </article>

          {/* 예시 2: 성분 과장 */}
          <article className="card group hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="warning">심각도: 중간</Badge>
              <Badge variant="info">패턴: 오인 유도</Badge>
            </div>
            <h3 className="heading-md mb-4">2) 로션을 임상 크림으로 포장</h3>
            <p className="text-body mb-6">
              제품 카테고리 대비 과도한 효능 암시 (전용·의학적 뉘앙스, 문구/비주얼 불일치)
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-gray-700">AI 분석 결과</span>
                <span className="text-orange-600 font-bold text-lg">위험도: 67%</span>
              </div>
            </div>
          </article>

          {/* 예시 3: 수치 오용 */}
          <article className="card group hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="danger">심각도: 높음</Badge>
              <Badge variant="info">패턴: 수치 오용</Badge>
            </div>
            <h3 className="heading-md mb-4">3) 임상 시험 수치 미인증</h3>
            <p className="text-body mb-6">
              검증 불가한 출처/표본, p-value/context 누락, 유의성 표기 남용
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-gray-700">AI 분석 결과</span>
                <span className="text-red-600 font-bold text-lg">위험도: 92%</span>
              </div>
            </div>
          </article>

          {/* 예시 4: 이미지 보정 */}
          <article className="card group hover:shadow-2xl transition-all duration-300">
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="danger">심각도: 높음</Badge>
              <Badge variant="warning">패턴: 이미지 보정</Badge>
            </div>
            <h3 className="heading-md mb-4">4) 보정으로 만든 가짜 효과</h3>
            <p className="text-body mb-6">
              조명/각도/메이크업/포즈 차이로 개선처럼 보이게 하는 전형적인 속임수
            </p>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-gray-700">AI 분석 결과</span>
                <span className="text-red-600 font-bold text-lg">위험도: 88%</span>
              </div>
            </div>
          </article>
        </div>

        <div className="text-center mt-16">
          <p className="text-body-lg text-gray-600 mb-8">더 많은 사례가 궁금하신가요?</p>
          <button onClick={onCheckClick} className="btn-primary text-lg">
            내 상품도 확인해보기
          </button>
        </div>
      </div>
    </section>
  );
}
