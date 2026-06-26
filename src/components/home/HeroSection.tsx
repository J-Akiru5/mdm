"use client";

import Button from "../ui/Button";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  onQuoteOpen: () => void;
}

export default function HeroSection({ onQuoteOpen }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          EVENTS THAT <span className={styles.highlight}>MOVE</span> PEOPLE,{" "}
          <span className={styles.highlight}>BRANDS</span>, AND{" "}
          <span className={styles.highlight}>COMMUNITIES</span>.
        </h1>
        <p className={styles.subtitle}>
          Professional event planning, production, and management services
          tailored to your vision.
        </p>
        <div className={styles.actions}>
          <Button onClick={onQuoteOpen}>Request a Proposal</Button>
          <Button variant="outline" as="a" href="/contact">
            Talk to Our Team
          </Button>
        </div>
      </div>
    </section>
  );
}
