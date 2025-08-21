"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

// 데이터 타입 정의
interface MetricData {
  views: number;
  ctaClicks: number;
  emailSubmits: number;
}

interface ProblemItem {
  icon: string;
  title: string;
  description: string;
}

interface MetricItem {
  value: number;
  label: string;
  sublabel: string;
}

interface HeroSectionProps {
  metrics: MetricData;
  product: string;
  onProductChange: (value: string) => void;
  onCheckClick: () => void;
}

// 정적 데이터 분리
const PROBLEM_DATA: ProblemItem[] = [
  {
    icon: "💸",
    title: "가격 거품",
    description: "원가 1만원 제품을 5만원으로 뻥튀기",
  },
  {
    icon: "🎭",
    title: "과대 효능",
    description: '"3일만에 10kg 감량" 허위 광고',
  },
  {
    icon: "🤖",
    title: "조작 리뷰",
    description: "가짜 후기와 별점 조작으로 속임",
  },
  {
    icon: "🧪",
    title: "성분 과장",
    description: '일반 로션을 "의학적 전용 크림"으로 포장',
  },
];

// 메트릭 데이터 가공 함수
const getMetricItems = (metrics: MetricData): MetricItem[] => [
  {
    value: metrics.views,
    label: "누적 조회수",
    sublabel: "실시간 업데이트",
  },
  {
    value: metrics.ctaClicks,
    label: "분석 요청",
    sublabel: "AI 검증 완료",
  },
  {
    value: metrics.emailSubmits,
    label: "알파 테스터",
    sublabel: "우선 알림 신청",
  },
];

// UI 컴포넌트들
const MetricCard = ({ item }: { item: MetricItem }) => (
  <div className="metric-card group hover:scale-105 transition-transform">
    <div className="stat-number">{item.value.toLocaleString()}</div>
    <div className="text-base font-semibold text-gray-700 mb-1">{item.label}</div>
    <div className="text-small">{item.sublabel}</div>
  </div>
);

const ProblemCard = ({ problem }: { problem: ProblemItem }) => (
  <div className="problem-card">
    <span className="text-3xl flex items-center h-full">{problem.icon}</span>
    <div className="flex flex-col justify-center items-center w-full">
      <div className="font-bold text-gray-900 mb-2 text-lg">{problem.title}</div>
      <div className="text-body">{problem.description}</div>
    </div>
  </div>
);

const SearchForm = ({
  product,
  onProductChange,
  onCheckClick,
}: {
  product: string;
  onProductChange: (value: string) => void;
  onCheckClick: () => void;
}) => (
  <div className="max-w-4xl mx-auto mb-20">
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl shadow-xl border-2 border-gray-200">
      <input
        value={product}
        onChange={(e) => onProductChange(e.target.value)}
        placeholder="상품명 또는 URL을 입력하세요 (예: 비타민C 1000mg 영양제)"
        className="flex-1 px-8 py-5 text-lg border-none outline-none bg-transparent placeholder:text-gray-500 font-medium"
        onKeyPress={(e) => e.key === "Enter" && onCheckClick()}
      />
      <button onClick={onCheckClick} className="btn-primary text-lg whitespace-nowrap">
        🔍 판별하기
      </button>
    </div>
    <p className="text-small mt-6">예시: "콜라겐 피부 미백 영양제" 또는 쿠팡/11번가 상품 링크</p>
  </div>
);

export default function HeroSection({
  metrics,
  product,
  onProductChange,
  onCheckClick,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  // 메트릭 데이터 가공
  const metricItems = getMetricItems(metrics);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // HERO 섹션 페이드업 애니메이션
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power2.out" }
      );
    }

    // 메트릭 카드 호버 애니메이션
    gsap.utils.toArray(".metric-card").forEach((card: any) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });

      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });
  }, []);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max text-center" ref={heroRef}>
        {/* 메인 타이틀 */}
        <div className="mb-12">
          <h1 className="heading-xl mb-8">
            이 상품,{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              과장광고
            </span>
            <br />
            일까요?
          </h1>
          <p className="text-body-lg max-w-5xl mx-auto mb-16">
            상품명이나 URL을 입력하고 AI로 과장광고 위험도를 확인하세요
            <br />
            <span className="text-gray-900 font-semibold">성분·광고문구·판매처 정보</span>를
            종합적으로 분석합니다
          </p>
        </div>

        {/* 메인 검색 폼 */}
        <SearchForm
          product={product}
          onProductChange={onProductChange}
          onCheckClick={onCheckClick}
        />

        {/* 실시간 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {metricItems.map((item, index) => (
            <MetricCard key={index} item={item} />
          ))}
        </div>

        {/* 문제 인식 섹션 - 글자 너비 개선 */}
        <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-xl border-2 border-gray-200 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-6">🚨 이런 경험 있으신가요?</h2>
            <p className="text-body-lg text-gray-600 max-w-4xl mx-auto">
              매년 수천억 원의 피해를 입히는 과장광고의 실체
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 max-w-6xl mx-auto">
            {PROBLEM_DATA.map((problem, index) => (
              <ProblemCard key={index} problem={problem} />
            ))}
          </div>

          <div className="cta-section max-w-4xl mx-auto">
            <h3 className="heading-md mb-6">💡 당사모가 AI로 이런 문제들을 미리 찾아드립니다</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button onClick={onCheckClick} className="btn-primary text-lg">
                🔍 지금 바로 확인하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
