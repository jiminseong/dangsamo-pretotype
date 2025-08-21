"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import PriceAuditDemo from "./PriceAuditDemo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PriceAuditSection() {
  const priceAuditRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 가격 감사 섹션 애니메이션
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
  }, []);

  return (
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
  );
}
