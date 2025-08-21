"use client";
import { useEffect, useState } from "react";

const METRIC_KEY = "ds_metrics_v1";

type Metrics = { views: number; ctaClicks: number; emailSubmits: number; last?: string | null };
const defaultMetrics: Metrics = { views: 0, ctaClicks: 0, emailSubmits: 0, last: null };

export function useMetrics() {
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
