"use client";

import Button from "../ui/Button";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  onQuoteOpen: () => void;
}

export default function HeroSection({ onQuoteOpen }: HeroSectionProps) {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>MDM EVENTS MANAGEMENT</p>
        <h1 className={styles.title}>
          Events That <em className={styles.highlight}>Move</em> People, Brands, and Communities.
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
    </section>
  );
}
