"use client";
import ShareButton from "./ShareButton";

export default function Footer() {
  return (
    <footer className="section-padding bg-gray-900 text-white">
      <div className="container-max">
        {/* 메인 콘텐츠 영역 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* 브랜드 섹션 */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-gray-900 font-black text-xl">
                당
              </div>
              <span className="text-2xl font-bold">당사모</span>
            </div>
            <p className="text-gray-300 text-base leading-relaxed mb-4">
              당하기 싫은 사람들의 모임
              <br />
              AI로 과장광고를 미리 찾아드립니다
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span>프리토타입 테스트 중</span>
            </div>
          </div>

          {/* 피해 현황 (2025년 실제 데이터) */}
          <div>
            <h4 className="font-bold text-lg mb-4">🚨 피해 현황</h4>
            <ul className="space-y-3 text-base text-gray-300">
              <li className="flex justify-between">
                <span>2024년 온라인 사기</span>
                <span className="text-red-400 font-semibold">3.2조원</span>
              </li>
              <li className="flex justify-between">
                <span>과장광고 신고</span>
                <span className="text-yellow-400 font-semibold">18만+ 건</span>
              </li>
              <li className="flex justify-between">
                <span>평균 피해액</span>
                <span className="text-orange-400 font-semibold">178만원</span>
              </li>
              <li className="text-sm text-gray-400 mt-4">📊 출처: 경찰청, 공정거래위원회 (2024)</li>
            </ul>
          </div>

          {/* 프리토타입 정보 */}
          <div>
            <h4 className="font-bold text-lg mb-4">🧪 프리토타입</h4>
            <ul className="space-y-3 text-base text-gray-300">
              <li className="flex justify-between">
                <p className="text-sm text-gray-400 mb-2">서비스 공유</p>
                <ShareButton className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600" />
              </li>
              <li className="flex justify-between">
                <p className="text-blue-400">📧 피드백:</p>
                <p> prototype@dangsamo.kr</p>
              </li>
              <li className="flex justify-between">
                <p className="text-green-400">💡 아이디어 제안:</p>
                <p> prototype@dangsamo.kr</p>
              </li>
              <li className="flex justify-between">
                <p className="text-purple-400">🚀 정식 서비스 준비 중: </p>
                <p>정식 서비스 준비 중</p>
              </li>
            </ul>
            <div className="space-y-4">
              <div></div>
            </div>
          </div>
        </div>

        {/* 프리토타입 안내 */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="text-center">
            <h5 className="font-semibold text-lg text-yellow-400 mb-4">
              ⚠️ 프리토타입 서비스 안내
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mx-auto">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h6 className="font-semibold text-white mb-2">현재 기능</h6>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• AI 기반 과장광고 분석 (데모)</li>
                  <li>• 가격 감사 시뮬레이션</li>
                  <li>• 사기 패턴 예시 제공</li>
                  <li>• 사용자 피드백 수집</li>
                </ul>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h6 className="font-semibold text-white mb-2">개발 예정</h6>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• 실시간 URL 분석</li>
                  <li>• 커뮤니티 제보 시스템</li>
                  <li>• 브라우저 확장 프로그램</li>
                  <li>• 모바일 앱 출시</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400 mb-4">
            &copy; 2025 당사모 프리토타입. 현명한 소비를 위한 AI 도구 개발 중.
          </p>

          {/* 프리토타입 메시지 */}
          <div className="p-4 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg">
            <p className="text-sm text-white">
              <strong>함께 만들어가는 서비스!</strong>
              <span className="ml-2">
                여러분의 피드백으로 더 나은 당사모를 만들어갑니다. 의견이나 제안이 있으시면 언제든
                연락주세요!
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
