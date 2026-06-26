'use client';

import { useState } from 'react';
import QuoteModal from '@/components/ui/QuoteModal';
import SectionHeading from '@/components/ui/SectionHeading';
import StatCounter from '@/components/ui/StatCounter';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { stats } from '@/data/stats';
import styles from './page.module.css';

export default function AboutPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className={styles.heroLabel}>ABOUT US</span>
          <h1 className={styles.heroTitle}>We Bring Your Vision to Life.</h1>
          <p className={styles.heroSub}>
            MDM Events Management — passionate planners, creatives, and problem-solvers.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section">
        <div className="container">
          <div className={styles.split}>
            <ScrollReveal animation="fadeInLeft" className={styles.imageWrap}>
              <Image
                src="/images/about_team.jpg"
                alt="MDM Events Management Team"
                fill
                style={{ objectFit: 'cover', borderRadius: '12px' }}
                sizes="(max-width:768px) 100vw, 50vw"
                unoptimized
              />
            </ScrollReveal>
            <ScrollReveal animation="fadeInRight" className={styles.textWrap}>
              <span className={styles.sectionLabel}>WHO WE ARE</span>
              <h2 className={styles.sectionHeading}>
                Your Event. Professionally Handled.
              </h2>
              <p className={styles.text}>
                MDM Events Management is a team of passionate planners, creatives, and
                problem-solvers committed to delivering events that inspire and connect.
              </p>
              <p className={styles.text}>
                We believe every event has a purpose. And when it is planned with strategy,
                creativity, and passion, it becomes an experience that people will remember.
              </p>
              <div className={styles.statsRow}>
                {stats.map((stat) => (
                  <div key={stat.label} className={styles.miniStat}>
                    <span className={styles.miniStatValue}>{stat.value}{stat.suffix}</span>
                    <span className={styles.miniStatLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section-off-white">
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.15}>
                <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <SectionHeading subtitle="Our Purpose" title="Mission &amp; Vision" align="center" />
          <div className={styles.missionGrid}>
            <ScrollReveal>
              <div className={styles.missionCard}>
                <div className={styles.missionIconWrap}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h3 className={styles.missionTitle}>Our Mission</h3>
                <p className={styles.missionText}>
                  To create meaningful events that inspire, connect, and leave a lasting impact
                  through strategic planning, creative execution, and unwavering commitment to excellence.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className={styles.missionCard}>
                <div className={styles.missionIconWrap}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className={styles.missionTitle}>Our Vision</h3>
                <p className={styles.missionText}>
                  To be a trusted events partner known for creativity, reliability, and excellence —
                  transforming every vision into a reality that exceeds expectations.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-dark" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Let&apos;s Work Together</h2>
          <p className={styles.ctaText}>Have an event in mind? We&apos;d love to hear about it.</p>
          <Button onClick={() => setQuoteOpen(true)}>Get a Quote</Button>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
