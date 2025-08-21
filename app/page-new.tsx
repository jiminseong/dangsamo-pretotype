"use client";
import { useMemo, useState } from "react";
import { useMetrics } from "@/hooks/useMetrics";
import Modal from "@/components/Modal";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ExamplesSection from "@/components/ExamplesSection";
import FeaturesSection from "@/components/FeaturesSection";
import PriceAuditSection from "@/components/PriceAuditSection";
import HowToUseSection from "@/components/HowToUseSection";
import Footer from "@/components/Footer";
import AnalysisModal from "@/components/AnalysisModal";

export default function Page() {
  const { metrics, record, reset } = useMetrics();
  const [product, setProduct] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(true);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"loading" | "gate" | "done">("loading");

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
      <Header onReset={reset} />

      <HeroSection
        metrics={metrics}
        product={product}
        onProductChange={setProduct}
        onCheckClick={handleCheckClick}
      />

      <ExamplesSection onCheckClick={handleCheckClick} />

      <FeaturesSection />

      <PriceAuditSection />

      <HowToUseSection onCheckClick={handleCheckClick} />

      <Footer />

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
