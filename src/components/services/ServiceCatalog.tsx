"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { services } from "@/data/services";
import styles from "./ServiceCatalog.module.css";

export default function ServiceCatalog() {
  const [activeId, setActiveId] = useState<string>(services[0].id);
  const [visible, setVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(`service-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector("section")?.offsetHeight ?? 380;
      setVisible(scrollY > heroHeight - 60);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = services.map((svc) => {
      const el = document.getElementById(`service-${svc.id}`);
      return el;
    });

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("service-", "");
            setActiveId(id);
          }
        }
      },
      { threshold: 0.4, rootMargin: "-80px 0px -40% 0px" },
    );

    targets.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <nav
      className={`${styles.catalog} ${visible ? styles.catalogVisible : ""}`}
      aria-label="Services"
    >
      <span className={styles.label}>Services</span>
      <ul className={styles.list}>
        {services.map((svc, i) => (
          <li key={svc.id}>
            <button
              className={`${styles.item} ${activeId === svc.id ? styles.active : ""}`}
              onClick={() => scrollTo(svc.id)}
            >
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
              <span>{svc.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
