'use client';

import Button from '../ui/Button';
import styles from './CTABanner.module.css';

interface CTABannerProps {
  onQuoteOpen: () => void;
}

export default function CTABanner({ onQuoteOpen }: CTABannerProps) {
  return (
    <section className={styles.banner}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.text}>
            <h2 className={styles.title}>READY TO PLAN YOUR NEXT EVENT?</h2>
            <p className={styles.description}>
              Let&apos;s work together and make it extraordinary.
            </p>
          </div>
          <Button onClick={onQuoteOpen}>Get Started</Button>
        </div>
      </div>
    </section>
  );
}
