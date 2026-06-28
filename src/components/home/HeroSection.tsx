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
            We plan, produce, and manage events that leave a lasting impact.
          </p>
          <div className={styles.actions}>
            <Button onClick={onQuoteOpen}>Request a Proposal</Button>
            <Button variant="outline" as="a" href="#about">
              Talk to Our Team
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
