// Next.js 클라이언트 컴포넌트로 지정 (브라우저에서 실행)
"use client";

// React 훅들 import
import { useMemo, useState } from "react";

// 커스텀 훅: 사용자 행동 추적을 위한 메트릭스 관리
import { useMetrics } from "@/hooks/useMetrics";

// UI 컴포넌트들 import
import Modal from "@/components/Modal"; // 모달 컨테이너
import Header from "@/components/Header"; // 헤더 (로고, 리셋 버튼)
import HeroSection from "@/components/HeroSection"; // 메인 히어로 섹션
import ExamplesSection from "@/components/ExamplesSection"; // 사기 사례 예시들
import FeaturesSection from "@/components/FeaturesSection"; // 주요 기능 소개
import PriceAuditSection from "@/components/PriceAuditSection"; // 가격 감사 데모
import HowToUseSection from "@/components/HowToUseSection"; // 사용법 안내
import Footer from "@/components/Footer"; // 푸터
import AnalysisModal from "@/components/AnalysisModal"; // 분석 모달 내용

export default function Page() {
  // 사용자 행동 추적을 위한 메트릭스 관리
  // record: 이벤트 기록, reset: 데이터 초기화, metrics: 현재 통계
  const { metrics, record, reset } = useMetrics();

  // 폼 상태 관리
  const [product, setProduct] = useState(""); // 사용자가 입력한 상품명
  const [email, setEmail] = useState(""); // 이메일 주소
  const [agree, setAgree] = useState(true); // 약관 동의 여부
  const [open, setOpen] = useState(false); // 모달 열림/닫힘 상태

  // 분석 모달의 진행 단계
  // "loading": 분석 중, "gate": 이메일 입력, "done": 완료
  const [phase, setPhase] = useState<"loading" | "gate" | "done">("loading");

  // UTM 파라미터 추출 (마케팅 추적용)
  // URL의 쿼리 파라미터에서 utm_source, utm_medium 등을 추출하여
  // 사용자가 어디서 왔는지 추적할 수 있게 함
  const utm = useMemo(() => {
    if (typeof window === "undefined") return {}; // 서버사이드에서는 빈 객체 반환
    const params = new URLSearchParams(window.location.search);
    const obj: Record<string, string> = {};

    // UTM 파라미터들을 추출
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
      const v = params.get(k);
      if (v) obj[k] = v;
    });

    obj["referrer"] = document.referrer || ""; // 이전 페이지 URL
    return obj;
  }, []);

  // "지금 확인하기" 버튼 클릭 핸들러
  const handleCheckClick = () => {
    record("ctaClicks"); // CTA 클릭 이벤트 기록
    setOpen(true); // 모달 열기
    setPhase("loading"); // 로딩 단계로 설정
    setTimeout(() => setPhase("gate"), 1200); // 1.2초 후 이메일 입력 단계로 전환
  };

  // 이메일 제출 핸들러
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이메일 형식 검증 (정규식 사용)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return alert("이메일 형식이 올바르지 않습니다.");
    }

    // 약관 동의 확인
    if (!agree) return alert("약관에 동의해 주세요.");

    record("emailSubmits"); // 이메일 제출 이벤트 기록
    setPhase("done"); // 완료 단계로 전환

    // 백엔드 API로 관심 고객 정보 전송
    try {
      await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          product,
          utm, // UTM 파라미터 포함
          ts: Date.now(), // 타임스탬프
        }),
      });
    } catch {
      // 에러 발생해도 사용자 경험을 위해 조용히 처리
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 상단 헤더 - 로고와 리셋 버튼 */}
      <Header onReset={reset} />

      {/* 메인 히어로 섹션 - 제목, 설명, 상품명 입력, CTA 버튼 */}
      <HeroSection
        metrics={metrics}
        product={product}
        onProductChange={setProduct}
        onCheckClick={handleCheckClick}
      />

      {/* 사기 사례 예시들 - 실제 사례 이미지들 */}
      <ExamplesSection onCheckClick={handleCheckClick} />

      {/* 주요 기능 소개 - 당사모의 핵심 기능들 */}
      <FeaturesSection />

      {/* 가격 감사 데모 - 실제 작동하는 데모 */}
      <PriceAuditSection />

      {/* 사용법 안내 - 3단계 사용법 */}
      <HowToUseSection onCheckClick={handleCheckClick} />

      {/* 푸터 - 연락처, 법적 고지 등 */}
      <Footer />

      {/* 분석 결과 모달 - 로딩/이메일입력/완료 단계 */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <AnalysisModal
          phase={phase}
          email={email}
          agree={agree}
          onEmailChange={setEmail}
          onAgreeChange={setAgree}
          onEmailSubmit={handleEmailSubmit}
        />
      </Modal>
    </main>
  );
}
