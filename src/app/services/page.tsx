"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QuoteModal from "@/components/ui/QuoteModal";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { services } from "@/data/services";
import styles from "./page.module.css";

export default function ServicesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <section className={styles.hero}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>OUR SERVICES</span>
          <h1 className={styles.heroTitle}>Solutions for Every Type of Event.</h1>
          <p className={styles.heroSub}>
            From planning to production, we provide end-to-end event management services tailored to
            your needs.
          </p>
        </div>
      </section>

      {services.map((svc, i) => {
        const isEven = i % 2 === 0;
        return (
          <ScrollReveal key={svc.id}>
            <section className={`${styles.section} ${isEven ? "" : styles.sectionAlt}`}>
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
                  <span className={styles.sectionIndex}>0{i + 1}</span>
                  <h2 className={styles.sectionTitle}>{svc.title}</h2>
                  <p className={styles.sectionTagline}>{svc.tagline}</p>
                  <p className={styles.sectionDesc}>{svc.description}</p>
                  <Link
                    href={`/services/${svc.id === "technology-support" ? "technology" : svc.id}`}
                    className={styles.sectionLink}
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>
        );
      })}

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
