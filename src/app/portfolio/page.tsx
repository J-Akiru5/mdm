"use client";

import { useState, useEffect } from "react";
import QuoteModal from "@/components/ui/QuoteModal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import Image from "next/image";
import styles from "./page.module.css";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
}

const categories = [
  { id: "all", label: "All" },
  { id: "corporate", label: "Corporate" },
  { id: "government", label: "Government" },
  { id: "launches", label: "Launches" },
  { id: "festivals", label: "Festivals" },
];

export default function PortfolioPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      });
  }, []);

  const filteredItems =
    activeCategory === "all" ? items : items.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className={styles.hero}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>OUR PORTFOLIO</span>
          <h1 className={styles.heroTitle}>A Glimpse of the Events We&apos;ve Made Possible.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.filters}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filter} ${activeCategory === cat.id ? styles.filterActive : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#999" }}>Loading...</p>
          ) : (
            <div className={styles.grid}>
              {filteredItems.map((item, i) => (
                <ScrollReveal key={item.id} delay={(i % 4) * 0.1}>
                  <div className={styles.item}>
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width:768px) 100vw, 25vw"
                      unoptimized
                    />
                    <div className={styles.itemOverlay}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <span className={styles.itemCategory}>{item.category}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section-dark" style={{ textAlign: "center" }}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Your event could be our next success story.</h2>
          <Button onClick={() => setQuoteOpen(true)}>Let&apos;s Plan It</Button>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
