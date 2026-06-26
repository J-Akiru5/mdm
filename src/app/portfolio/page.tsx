'use client';

import { useState } from 'react';
import QuoteModal from '@/components/ui/QuoteModal';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/ui/ScrollReveal';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { portfolioItems, portfolioCategories } from '@/data/portfolio';
import styles from './page.module.css';

const portfolioImages: Record<string, string> = {
  'corporate-1': '/images/portfolio/corporate.jpg',
  'corporate-2': '/images/portfolio/corporate.jpg',
  'festival-1': '/images/portfolio/festival.jpg',
  'festival-2': '/images/portfolio/festival.jpg',
  'launch-1': '/images/portfolio/launch.jpg',
  'launch-2': '/images/portfolio/launch.jpg',
  'exhibit-1': '/images/portfolio/exhibit.jpg',
  'exhibit-2': '/images/portfolio/exhibit.jpg',
  'government-1': '/images/portfolio/corporate.jpg',
  'government-2': '/images/portfolio/corporate.jpg',
};

export default function PortfolioPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems =
    activeCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className={styles.heroLabel}>OUR PORTFOLIO</span>
          <h1 className={styles.heroTitle}>A Glimpse of the Events We&apos;ve Made Possible.</h1>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="container">
          {/* Category Filters */}
          <div className={styles.filters}>
            {portfolioCategories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filter} ${activeCategory === cat.id ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className={styles.grid}>
            {filteredItems.map((item, i) => (
              <ScrollReveal key={item.id} delay={(i % 4) * 0.1}>
                <div className={styles.item}>
                  <Image
                    src={portfolioImages[item.id] || '/images/portfolio/corporate.jpg'}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width:768px) 100vw, 25vw"
                    unoptimized
                  />
                  <div className={styles.itemOverlay}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <span className={styles.itemCategory}>{item.category}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-dark" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Your event could be our next success story.</h2>
          <Button onClick={() => setQuoteOpen(true)}>Let&apos;s Plan It</Button>
        </div>
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
