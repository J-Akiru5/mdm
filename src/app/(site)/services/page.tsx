"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import QuoteModal from "@/components/ui/QuoteModal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { services } from "@/data/services";
import HeroGlobe from "@/components/ui/HeroGlobe";
import ServiceCatalog from "@/components/services/ServiceCatalog";
import styles from "./page.module.css";

export default function ServicesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const handler = () => setQuoteOpen(true);
    window.addEventListener("openQuoteModal", handler);
    return () => window.removeEventListener("openQuoteModal", handler);
  }, []);

  return (
    <>
      <section className={`${styles.hero} brandedHero`}>
        <HeroGlobe />
        <div className="container heroContent" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>OUR SERVICES</span>
          <h1 className={styles.heroTitle}>Solutions for Every Type of Event.</h1>
          <p className={styles.heroSub}>
            From planning to production, we provide end-to-end event management services tailored to
            your needs.
          </p>
        </div>
      </section>

      <ServiceCatalog />

      {services.map((svc, i) => {
        const isEven = i % 2 === 0;
        return (
          <ScrollReveal key={svc.id}>
            <section
              id={`service-${svc.id}`}
              className={`${styles.section} ${isEven ? "" : styles.sectionAlt}`}
            >
              <div className={`container ${styles.sectionInner}`}>
                <div
                  className={`${styles.sectionImage} ${isEven ? styles.imageLeft : styles.imageRight}`}
                >
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
                <div
                  className={`${styles.sectionText} ${isEven ? styles.textRight : styles.textLeft}`}
                >
                  <span className={styles.sectionIndex}>{String(i + 1).padStart(2, "0")}</span>
                  <h2 className={styles.sectionTitle}>{svc.title}</h2>
                  <p className={styles.sectionTagline}>{svc.tagline}</p>
                  <p className={styles.sectionDesc}>{svc.description}</p>
                  <Link href={`/services/${svc.id}`} className={styles.sectionLink}>
                    Learn More →
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>
        );
      })}

      {/* Our Workflow */}
      <section className={styles.workflowSection}>
        <div className="container">
          <SectionHeading
            subtitle="How We Work"
            title="Our Workflow"
            description="A proven 6-step process from concept to completion."
            align="center"
          />
          <div className={styles.workflowGrid}>
            <div className={styles.workflowRow}>
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>01</span>
                <h3 className={styles.stepTitle}>Discovery &amp; Consultation</h3>
                <p className={styles.stepDesc}>
                  We begin by understanding your vision, goals, audience, and brand identity.
                </p>
              </div>
              <div className={styles.connector} aria-hidden="true" />
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>02</span>
                <h3 className={styles.stepTitle}>Concept Development &amp; Proposal</h3>
                <p className={styles.stepDesc}>
                  We present a creative direction, theme, and strategy tailored to your objectives.
                </p>
              </div>
              <div className={styles.connector} aria-hidden="true" />
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>03</span>
                <h3 className={styles.stepTitle}>Planning &amp; Coordination</h3>
                <p className={styles.stepDesc}>
                  Detailed project timeline, vendor sourcing, and logistics planning come together.
                </p>
              </div>
            </div>

            <div className={styles.rowConnector} aria-hidden="true" />

            <div className={styles.workflowRow}>
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>04</span>
                <h3 className={styles.stepTitle}>Design &amp; Production</h3>
                <p className={styles.stepDesc}>
                  We handle all aesthetics—stage, branding, tech, d&eacute;cor, and digital
                  elements.
                </p>
              </div>
              <div className={styles.connector} aria-hidden="true" />
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>05</span>
                <h3 className={styles.stepTitle}>Event Execution</h3>
                <p className={styles.stepDesc}>
                  On-site management, coordination, and contingency handling&mdash;all hands on
                  deck.
                </p>
              </div>
              <div className={styles.connector} aria-hidden="true" />
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>06</span>
                <h3 className={styles.stepTitle}>Post-Event Evaluation</h3>
                <p className={styles.stepDesc}>
                  We wrap up with performance metrics, client feedback, and continuous improvement
                  insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>Need a customized solution?</h2>
              <p className={styles.ctaText}>
                We&apos;ll tailor our services to match your event goals and budget.
              </p>
            </div>
            <Button onClick={() => setQuoteOpen(true)}>Talk to Our Team</Button>
          </div>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
