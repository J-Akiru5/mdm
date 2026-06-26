"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollReveal.module.css";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: "fadeInUp" | "fadeInLeft" | "fadeInRight";
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = "fadeInUp",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${styles[animation]} ${isVisible ? styles.visible : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
