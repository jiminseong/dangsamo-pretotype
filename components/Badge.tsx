"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "danger" | "warning" | "success" | "info";
}) {
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (badgeRef.current) {
      // 마운트 애니메이션
      gsap.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, []);

  const variants = {
    default: "badge badge-default",
    danger: "badge badge-danger",
    warning: "badge badge-warning",
    success: "badge badge-success",
    info: "badge badge-info",
  };

  return (
    <span ref={badgeRef} className={variants[variant]}>
      {children}
    </span>
  );
}
