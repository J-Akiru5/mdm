"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./StatCounter.module.css";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export default function StatCounter({
  value,
  suffix = "",
  label,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const step = Math.max(1, Math.floor(value / 60));
          const timer = setInterval(() => {
            start += step;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, duration / 60);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className={styles.stat}>
      <span className={styles.value}>
        {count}
        {suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
