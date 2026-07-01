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
            FROM <span className={styles.highlight}>IDEAS</span> TO
            <br />
            DIGITAL <span className={styles.highlight}>IMPACT</span>.
          </h1>
          <p className={styles.subtitle}>
            We empower organizations to innovate, connect, and grow through technology, creativity,
            and digital transformation.
          </p>
          <div className={styles.actions}>
            <Button onClick={onQuoteOpen}>Start Your Digital Journey</Button>
            <Button variant="outline" as="a" href="#about">
              Explore Our Services
            </Button>
          </div>
        </div>

        {/* ── Right: Logo panel ── */}
        <div className={styles.logoPanel} aria-hidden="true">
          {/* Layered decorative rings */}
          <div className={styles.logoRingOuter} />
          <div className={styles.logoRing} />

          {/* Red ambient glow */}
          <div className={styles.logoGlow} />

          {/* White faded background glow behind logo */}
          <div className={styles.logoWhiteBg} aria-hidden="true" />

          {/* Logo — transparent version */}
          <div className={styles.logoWrap}>
            <Image
              src="/logo/mdm_logo_t.png"
              alt="MDM Events Management"
              fill
              style={{ objectFit: "contain" }}
              priority
              className={styles.logoImg}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
