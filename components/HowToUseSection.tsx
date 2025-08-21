"use client";
import ShareButton from "./ShareButton";

interface HowToUseSectionProps {
  onCheckClick: () => void;
}

export default function HowToUseSection({ onCheckClick }: HowToUseSectionProps) {
  return (
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

          <button onClick={onCheckClick} className="btn-primary text-lg mt-10">
            🎯 알파 테스터 신청하기
          </button>
        </div>
      </div>
    </section>
  );
}
