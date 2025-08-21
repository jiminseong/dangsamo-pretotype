"use client";
import { useMemo } from "react";

interface AnalysisModalProps {
  phase: "loading" | "gate" | "done";
  email: string;
  agree: boolean;
  onEmailChange: (value: string) => void;
  onAgreeChange: (checked: boolean) => void;
  onEmailSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function AnalysisModal({
  phase,
  email,
  agree,
  onEmailChange,
  onAgreeChange,
  onEmailSubmit,
}: AnalysisModalProps) {
  const content = useMemo(() => {
    switch (phase) {
      case "loading":
        return (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-gray-900 mx-auto mb-6"></div>
            <h3 className="heading-md mb-3">AI 분석 중...</h3>
            <p className="text-body">상품 정보를 분석하고 있습니다</p>
          </div>
        );

      case "gate":
        return (
          <div className="text-center py-8">
            <div className="text-5xl mb-6">🎯</div>
            <h3 className="heading-lg mb-6">분석이 완료되었습니다!</h3>
            <p className="text-body mb-8">
              상세한 분석 결과를 이메일로 받아보시겠어요?
              <br />
              알파 테스터로 등록하시면 우선적으로 결과를 확인할 수 있습니다.
            </p>

            <form onSubmit={onEmailSubmit} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="input text-center"
                required
              />

              <label className="flex items-center justify-center gap-3 text-base text-gray-600">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => onAgreeChange(e.target.checked)}
                  className="rounded w-4 h-4"
                />
                분석 결과 및 서비스 소식 수신에 동의합니다
              </label>

              <button type="submit" className="btn-primary w-full text-lg">
                📧 분석 결과 받기
              </button>
            </form>
          </div>
        );

      case "done":
        return (
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
          </div>
        );

      default:
        return null;
    }
  }, [phase, email, agree, onEmailChange, onAgreeChange, onEmailSubmit]);

  return <>{content}</>;
}
