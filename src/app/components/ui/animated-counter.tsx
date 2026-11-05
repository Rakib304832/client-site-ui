"use client";

import { useEffect, useState, useRef } from "react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
};

/**
 * Counts up to `value` once the element becomes visible in the viewport.
 * Falls back to rendering the final value if IntersectionObserver isn't available.
 */
export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1400,
  decimals = 0,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState<number>(value);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;

    const startTime = Date.now();
    const decimalsMultiplier = Math.pow(10, decimals);

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      setStarted(true);

      function tick() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out quartic
        const ease = 1 - Math.pow(1 - progress, 4);
        const current =
          Math.round((0 + (value - 0) * ease) * decimalsMultiplier) /
          decimalsMultiplier;
        setDisplay(current);
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
      observer.disconnect();
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, [value, duration, decimals, started]);

  // SSR / no IntersectionObserver: render the final value immediately.
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    setDisplay(value);
  }

  return (
    <span ref={ref} className="font-bold tabular-nums">
      {prefix}
      {decimals === 0 ? Math.floor(display) : display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
