"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import QuoteModal from "@/components/ui/QuoteModal";
import { getTechServiceData, getTechSubServices, styles } from "./data";
import HeroGlobe from "@/components/ui/HeroGlobe";

export default function TechnologyPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const svc = getTechServiceData();
  const subServices = getTechSubServices();

  return (
    <>
      <section className={`${styles.hero} brandedHero`}>
        <HeroGlobe />
        <div className="container heroContent" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>TECHNOLOGY & DIGITAL SOLUTIONS</span>
          <h1 className={styles.heroTitle}>{svc.title}</h1>
          <p className={styles.heroSub}>{svc.tagline}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className={styles.overview}>{svc.description}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {svc.offerings.map((offering, i) => (
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

      {subServices.length > 0 && (
        <section className="section">
          <div className="container">
            <div className={styles.subGrid}>
              {subServices.map((svc, i) => (
                <ScrollReveal key={i} delay={(i % 3) * 0.1}>
                  <div className={styles.subCard}>
                    <span className={styles.subIcon}>{svc.icon}</span>
                    <h3 className={styles.subTitle}>{svc.title}</h3>
                    <p className={styles.subDesc}>{svc.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`section ${styles.processSection}`}>
        <div className="container">
          <div className={styles.processGrid}>
            {svc.process.map((p, i) => (
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

      <section className={styles.cta}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className={styles.ctaTitle}>Ready to get started?</h2>
          <p className={styles.ctaText}>Let&apos;s talk about how we can power your next event.</p>
          <Button onClick={() => setQuoteOpen(true)}>Request a Proposal</Button>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
