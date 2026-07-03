"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import QuoteModal from "@/components/ui/QuoteModal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { eventServices } from "@/data/services/eventServices";
import HeroGlobe from "@/components/ui/HeroGlobe";
import styles from "../page.module.css";

export default function EventServicesPage() {
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
          <span className={styles.heroLabel}>EVENT SERVICES</span>
          <h1 className={styles.heroTitle}>End-to-End Event Management.</h1>
          <p className={styles.heroSub}>
            From concept to execution, we deliver unforgettable event experiences — seamlessly
            managed by our dedicated team of professionals.
          </p>
        </div>
      </section>

      {eventServices.map((svc, i) => {
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
                  <Link href={`/services/events/${svc.id}`} className={styles.sectionLink}>
                    Learn More →
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>
        );
      })}

      {/* Our Event Workflow */}
      <section className={styles.workflowSection}>
        <div className="container">
          <SectionHeading
            subtitle="How We Work"
            title="Our Event Process"
            description="A proven 6-step process from concept to a flawlessly executed event."
            align="center"
          />
          <div className={styles.workflowGrid}>
            <div className={styles.workflowRow}>
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>01</span>
                <h3 className={styles.stepTitle}>Discovery &amp; Briefing</h3>
                <p className={styles.stepDesc}>
                  We listen to your vision, understand your goals, and define the scope of your
                  event.
                </p>
              </div>
              <div className={styles.connector} aria-hidden="true" />
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>02</span>
                <h3 className={styles.stepTitle}>Conceptualization</h3>
                <p className={styles.stepDesc}>
                  We develop a creative concept, theme, and experience blueprint tailored to your
                  brand.
                </p>
              </div>
              <div className={styles.connector} aria-hidden="true" />
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>03</span>
                <h3 className={styles.stepTitle}>Planning &amp; Coordination</h3>
                <p className={styles.stepDesc}>
                  We manage venue sourcing, vendor bookings, logistics, and every operational
                  detail.
                </p>
              </div>
            </div>

            <div className={styles.rowConnector} aria-hidden="true" />

            <div className={styles.workflowRow}>
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>04</span>
                <h3 className={styles.stepTitle}>Production &amp; Setup</h3>
                <p className={styles.stepDesc}>
                  Our team handles load-in, staging, AV setup, and all technical requirements.
                </p>
              </div>
              <div className={styles.connector} aria-hidden="true" />
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>05</span>
                <h3 className={styles.stepTitle}>Live Event Management</h3>
                <p className={styles.stepDesc}>
                  We run your event on the day — managing timelines, talent, guests, and on-ground
                  operations.
                </p>
              </div>
              <div className={styles.connector} aria-hidden="true" />
              <div className={styles.workflowStep}>
                <span className={styles.stepNumber}>06</span>
                <h3 className={styles.stepTitle}>Post-Event &amp; Reporting</h3>
                <p className={styles.stepDesc}>
                  We wrap up, gather feedback, and deliver a post-event report with key highlights
                  and insights.
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
              <h2 className={styles.ctaTitle}>Planning an event?</h2>
              <p className={styles.ctaText}>
                Let&apos;s create an experience your guests will never forget.
              </p>
            </div>
            <Button onClick={() => setQuoteOpen(true)}>Get a Proposal</Button>
          </div>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
