'use client';

import { useState } from 'react';
import QuoteModal from '@/components/ui/QuoteModal';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { services } from '@/data/services';
import styles from './page.module.css';

const serviceImages: Record<string, string> = {
  'event-planning': '/images/services/planning.jpg',
  'event-production': '/images/services/production.jpg',
  'event-management': '/images/services/management.jpg',
  'venue-supplier': '/images/services/venue.jpg',
  'registration': '/images/services/registration.jpg',
  'branding-design': '/images/services/branding.jpg',
};

export default function ServicesPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className={styles.heroLabel}>OUR SERVICES</span>
          <h1 className={styles.heroTitle}>Solutions for Every Type of Event.</h1>
          <p className={styles.heroSub}>
            From planning to production, we provide end-to-end event management services tailored to your needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {services.map((service, i) => (
              <ScrollReveal key={service.id} delay={(i % 3) * 0.1}>
                <div className={styles.card}>
                  <div className={styles.cardImageWrap}>
                    <Image
                      src={serviceImages[service.id] || '/images/hero_event.jpg'}
                      alt={service.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width:768px) 100vw, 33vw"
                      unoptimized
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <p className={styles.cardDesc}>{service.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
