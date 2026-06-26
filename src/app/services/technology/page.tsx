"use client";

import { useState } from "react";
import QuoteModal from "@/components/ui/QuoteModal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { techServices, techUsp } from "@/data/services/techServices";
import styles from "./page.module.css";

export default function TechnologyPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className={styles.hero}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>TECHNOLOGY & DIGITAL SOLUTIONS</span>
          <h1 className={styles.heroTitle}>Technology That Powers Modern Events.</h1>
          <p className={styles.heroSub}>{techUsp}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {techServices.map((svc, i) => (
              <ScrollReveal key={i} delay={(i % 3) * 0.1}>
                <div className={styles.card}>
                  <span className={styles.cardIcon}>{svc.icon}</span>
                  <h3 className={styles.cardTitle}>{svc.title}</h3>
                  <p className={styles.cardDesc}>{svc.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.uspBanner}>
        <div className="container">
          <p className={styles.uspQuote}>&ldquo;{techUsp}&rdquo;</p>
          <Button onClick={() => setQuoteOpen(true)}>Request a Proposal</Button>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
