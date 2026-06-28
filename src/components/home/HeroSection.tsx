"use client";

import Image from "next/image";
import Button from "../ui/Button";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  onQuoteOpen: () => void;
}

export default function HeroSection({ onQuoteOpen }: HeroSectionProps) {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.overlay} />

      <div className={styles.inner}>
        {/* ── Left: Text content ── */}
        <div className={styles.content}>
          <h1 className={styles.title}>
            EVENTS THAT <br />
            <span className={styles.highlight}>MOVE</span> PEOPLE,
            <br />
            <span className={styles.highlight}>BRANDS,</span> AND
            <br />
            COMMUNITIES.
          </h1>
          <p className={styles.subtitle}>
            Full-service event management powered by technology — from concept to execution.
          </p>
          <div className={styles.actions}>
            <Button onClick={onQuoteOpen}>Request a Proposal</Button>
            <Button variant="outline" as="a" href="#about">
              Talk to Our Team
            </Button>
          </div>
        </div>

        {/* ── Right: Event photography ── */}
        <div className={styles.imagePanel} aria-hidden="true">
          <Image
            src="/images/portfolio/corporate-conference.jpg"
            alt="MDM Events - Corporate Event Production"
            fill
            style={{ objectFit: "cover" }}
            priority
            className={styles.eventImage}
          />
        </div>
      </div>
    </section>
  );
}
