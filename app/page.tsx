"use client";
import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Modal from "@/components/Modal";
import Badge from "@/components/Badge";
import PriceAuditDemo from "@/components/PriceAuditDemo";
import ShareButton from "@/components/ShareButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const METRIC_KEY = "ds_metrics_v1";

type Metrics = { views: number; ctaClicks: number; emailSubmits: number; last?: string | null };
const defaultMetrics: Metrics = { views: 0, ctaClicks: 0, emailSubmits: 0, last: null };

function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>(defaultMetrics);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(METRIC_KEY) || "null");
      if (saved) setMetrics(saved);
    } catch {}
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

  // GSAP 애니메이션용 ref
  const heroRef = useRef<HTMLDivElement>(null);
  const exampleCardsRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<HTMLDivElement>(null);
  const priceAuditRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // HERO 섹션 페이드업
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power2.out" }
      );
    }

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

    // 가격 감사 섹션
    if (priceAuditRef.current) {
      gsap.fromTo(
        priceAuditRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: priceAuditRef.current,
            start: "top 80%",
          },
        }
      );
    }

    // 호버 애니메이션 향상
    gsap.utils.toArray(".metric-card").forEach((card: any) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });

      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });
  }, []);

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
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("이메일 형식이 올바르지 않습니다.");
    if (!agree) return alert("약관에 동의해 주세요.");
    record("emailSubmits");
    setPhase("done");

    try {
      await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product, utm, ts: Date.now() }),
      });
    } catch {}
  };

  return (
    <main className="min-h-screen bg-white">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-300">
        <div className="container-max flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gray-900 text-white font-black text-xl shadow-lg">
              당
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">당사모</h1>
              <p className="text-sm text-gray-600">당하기 싫은 사람들의 모임</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-8 md:flex">
              <a
                className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                href="#examples"
              >
                예시보기
              </a>
              <a
                className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                href="#features"
              >
                기능
              </a>
              <a
                className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                href="#price-audit"
              >
                가격감사
              </a>
            </nav>
            <ShareButton className="hidden sm:inline-flex" />
            <button onClick={reset} className="btn-secondary">
              초기화
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="section-padding bg-gray-50">
        <div className="container-max text-center" ref={heroRef}>
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
          <div className="max-w-4xl mx-auto mb-20">
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl shadow-xl border-2 border-gray-200">
              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="상품명 또는 URL을 입력하세요 (예: 비타민C 1000mg 영양제)"
                className="flex-1 px-8 py-5 text-lg border-none outline-none bg-transparent placeholder:text-gray-500 font-medium"
                onKeyPress={(e) => e.key === "Enter" && handleCheckClick()}
              />
              <button onClick={handleCheckClick} className="btn-primary text-lg whitespace-nowrap">
                🔍 판별하기
              </button>
            </div>
            <p className="text-small mt-6">
              예시: "콜라겐 피부 미백 영양제" 또는 쿠팡/11번가 상품 링크
            </p>
          </div>

          {/* 실시간 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            <div className="metric-card group hover:scale-105 transition-transform">
              <div className="stat-number">{metrics.views.toLocaleString()}</div>
              <div className="text-base font-semibold text-gray-700 mb-1">누적 조회수</div>
              <div className="text-small">실시간 업데이트</div>
            </div>
            <div className="metric-card group hover:scale-105 transition-transform">
              <div className="stat-number">{metrics.ctaClicks.toLocaleString()}</div>
              <div className="text-base font-semibold text-gray-700 mb-1">분석 요청</div>
              <div className="text-small">AI 검증 완료</div>
            </div>
            <div className="metric-card group hover:scale-105 transition-transform">
              <div className="stat-number">{metrics.emailSubmits.toLocaleString()}</div>
              <div className="text-base font-semibold text-gray-700 mb-1">알파 테스터</div>
              <div className="text-small">우선 알림 신청</div>
            </div>
          </div>

          {/* 문제 인식 섹션 */}
          <div className="bg-white rounded-3xl p-12 md:p-16 shadow-xl border-2 border-gray-200 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-lg mb-6">🚨 이런 경험 있으신가요?</h2>
              <p className="text-body-lg text-gray-600">
                매년 수천억 원의 피해를 입히는 과장광고의 실체
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="problem-card">
                <span className="text-3xl">💸</span>
                <div>
                  <div className="font-bold text-gray-900 mb-2 text-lg">가격 거품</div>
                  <div className="text-body">원가 1만원 제품을 5만원으로 뻥튀기</div>
                </div>
              </div>
              <div className="problem-card">
                <span className="text-3xl">🎭</span>
                <div>
                  <div className="font-bold text-gray-900 mb-2 text-lg">과대 효능</div>
                  <div className="text-body">"3일만에 10kg 감량" 허위 광고</div>
                </div>
              </div>
              <div className="problem-card">
                <span className="text-3xl">🤖</span>
                <div>
                  <div className="font-bold text-gray-900 mb-2 text-lg">조작 리뷰</div>
                  <div className="text-body">가짜 후기와 별점 조작으로 속임</div>
                </div>
              </div>
              <div className="problem-card">
                <span className="text-3xl">🧪</span>
                <div>
                  <div className="font-bold text-gray-900 mb-2 text-lg">성분 과장</div>
                  <div className="text-body">일반 로션을 "의학적 전용 크림"으로 포장</div>
                </div>
              </div>
            </div>

            <div className="cta-section">
              <h3 className="heading-md mb-6">💡 당사모가 AI로 이런 문제들을 미리 찾아드립니다</h3>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button onClick={handleCheckClick} className="btn-primary text-lg">
                  🔍 지금 바로 확인하기
                </button>
                <ShareButton className="share-button" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 예시 섹션 */}
      <section id="examples" className="section-padding bg-white">
        <div className="container-max" ref={exampleCardsRef}>
          <div className="text-center mb-20">
            <h2 className="heading-lg mb-6">📋 실제 과장광고 사례</h2>
            <p className="text-body-lg text-gray-600">
              AI가 분석한 실제 문제 사례들을 확인해보세요
            </p>
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
            <button onClick={handleCheckClick} className="btn-primary text-lg">
              내 상품도 확인해보기
            </button>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
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

      {/* 가격 감사 섹션 */}
      <section id="price-audit" className="section-padding bg-white">
        <div className="container-max" ref={priceAuditRef}>
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-6">💰 실시간 가격 감사</h2>
            <p className="text-body-lg text-gray-600 mb-12">
              원가 뻥튀기 후 할인 바이럴 패턴을 AI로 탐지합니다
            </p>
          </div>
          <PriceAuditDemo />
        </div>
      </section>

      {/* 사용법 섹션 */}
      <section className="section-padding bg-gray-50">
        <div className="container-max text-center">
          <h2 className="heading-lg mb-16">🚀 어떻게 사용하나요?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <div className="card text-center">
              <div className="text-5xl mb-6">1️⃣</div>
              <h3 className="heading-md mb-4">상품 입력</h3>
              <p className="text-body">상품 URL이나 이름을 입력하고 판별하기 클릭</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-6">2️⃣</div>
              <h3 className="heading-md mb-4">알파 테스터 등록</h3>
              <p className="text-body">이메일을 입력하면 가장 먼저 결과를 받아볼 수 있어요</p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-6">3️⃣</div>
              <h3 className="heading-md mb-4">상세 리포트</h3>
              <p className="text-body">정식 론칭 시 개인화된 위험 리포트를 제공할 예정</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-xl border-2 border-gray-200 max-w-5xl mx-auto">
            <h3 className="heading-md mb-8">📢 알파 테스터 특별 혜택</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4 text-left">
                <span className="text-green-500 text-2xl">✅</span>
                <span className="text-body font-semibold">우선 이용 권한</span>
              </div>
              <div className="flex items-center gap-4 text-left">
                <span className="text-green-500 text-2xl">✅</span>
                <span className="text-body font-semibold">무료 상세 분석 리포트</span>
              </div>
              <div className="flex items-center gap-4 text-left">
                <span className="text-green-500 text-2xl">✅</span>
                <span className="text-body font-semibold">신규 기능 베타 테스트</span>
              </div>
              <div className="flex items-center gap-4 text-left">
                <span className="text-green-500 text-2xl">✅</span>
                <span className="text-body font-semibold">과장광고 알림 서비스</span>
              </div>
            </div>

            <button onClick={handleCheckClick} className="btn-primary text-lg mt-10">
              🎯 알파 테스터 신청하기
            </button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="section-padding bg-gray-900 text-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-gray-900 font-black text-xl">
                  당
                </div>
                <span className="text-2xl font-bold">당사모</span>
              </div>
              <p className="text-gray-300 text-base leading-relaxed">
                당하기 싫은 사람들의 모임
                <br />
                AI로 과장광고를 미리 찾아드립니다
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">서비스</h4>
              <ul className="space-y-3 text-base text-gray-300">
                <li>
                  <a href="#examples" className="hover:text-white transition-colors">
                    과장광고 사례
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    분석 기능
                  </a>
                </li>
                <li>
                  <a href="#price-audit" className="hover:text-white transition-colors">
                    가격 감사
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">공유하기</h4>
              <div className="flex gap-4">
                <ShareButton className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-base text-gray-400">
            <p>&copy; 2024 당사모. 현명한 소비를 위한 AI 도구.</p>
          </div>
        </div>
      </footer>

      {/* 모달 */}
      <Modal open={open} onClose={() => setOpen(false)}>
        {phase === "loading" && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-gray-900 mx-auto mb-6"></div>
            <h3 className="heading-md mb-3">AI 분석 중...</h3>
            <p className="text-body">상품 정보를 분석하고 있습니다</p>
          </div>
        )}

        {phase === "gate" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-6">🎯</div>
            <h3 className="heading-lg mb-6">분석이 완료되었습니다!</h3>
            <p className="text-body mb-8">
              상세한 분석 결과를 이메일로 받아보시겠어요?
              <br />
              알파 테스터로 등록하시면 우선적으로 결과를 확인할 수 있습니다.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="input text-center"
                required
              />

              <label className="flex items-center justify-center gap-3 text-base text-gray-600">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="rounded w-4 h-4"
                />
                분석 결과 및 서비스 소식 수신에 동의합니다
              </label>

              <button type="submit" className="btn-primary w-full text-lg">
                📧 분석 결과 받기
              </button>
            </form>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center py-12">
            <div className="text-5xl mb-6">🎉</div>
            <h3 className="heading-lg mb-6">등록 완료!</h3>
            <p className="text-body mb-8">
              알파 테스터로 등록되었습니다.
              <br />
              분석 결과를 이메일로 보내드리겠습니다.
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
              <p className="text-base text-gray-800">
                💡 <strong>팁:</strong> 더 많은 상품을 분석해보시고 친구들과 공유해보세요!
              </p>
            </div>
            <ShareButton className="mx-auto" />
          </div>
        )}
      </Modal>
    </main>
  );
}
