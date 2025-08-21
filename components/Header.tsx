"use client";
import ShareButton from "./ShareButton";

interface HeaderProps {
  onReset: () => void;
}

export default function Header({ onReset }: HeaderProps) {
  return (
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
          <button onClick={onReset} className="btn-secondary">
            초기화
          </button>
        </div>
      </div>
    </header>
  );
}
