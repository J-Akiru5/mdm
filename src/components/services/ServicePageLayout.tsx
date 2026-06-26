"use client";

import { useState, type ReactNode } from "react";
import QuoteModal from "@/components/ui/QuoteModal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import styles from "./ServicePageLayout.module.css";

interface ServicePageLayoutProps {
  label: string;
  title: string;
  tagline: string;
  description: string;
  offerings: string[];
  process: { step: string; title: string; description: string }[];
  children?: ReactNode;
}

export default function ServicePageLayout({
  label,
  title,
  tagline,
  description,
  offerings,
  process,
  children,
}: ServicePageLayoutProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className={styles.hero}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>{label}</span>
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroSub}>{tagline}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className={styles.overview}>{description}</p>
        </div>
      </section>

      {offerings.length > 0 && (
        <section className="section">
          <div className="container">
            <div className={styles.grid}>
              {offerings.map((offering, i) => (
                <ScrollReveal key={i} delay={(i % 3) * 0.1}>
                  <div className={styles.offeringCard}>
                    <span className={styles.check}>✓</span>
                    <span className={styles.offeringText}>{offering}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {children}

      {process.length > 0 && (
        <section className={`section ${styles.processSection}`}>
          <div className="container">
            <div className={styles.processGrid}>
              {process.map((p, i) => (
                <ScrollReveal key={i} delay={i * 0.15}>
                  <div className={styles.processStep}>
                    <div className={styles.stepNumber}>{p.step}</div>
                    <h3 className={styles.stepTitle}>{p.title}</h3>
                    <p className={styles.stepDesc}>{p.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.cta}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Ready to get started?</h2>
          <p className={styles.ctaText}>
            Let&apos;s talk about how we can bring your event to life.
          </p>
          <Button onClick={() => setQuoteOpen(true)}>Request a Proposal</Button>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
