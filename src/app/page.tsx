'use client';

import { useState } from 'react';
import QuoteModal from '@/components/ui/QuoteModal';
import HeroSection from '@/components/home/HeroSection';
import CoreValues from '@/components/home/CoreValues';
import AboutPreview from '@/components/home/AboutPreview';
import WhatWeDo from '@/components/home/WhatWeDo';
import CTABanner from '@/components/home/CTABanner';

export default function HomePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <HeroSection onQuoteOpen={() => setQuoteOpen(true)} />
      <CoreValues />
      <AboutPreview />
      <WhatWeDo onQuoteOpen={() => setQuoteOpen(true)} />
      <CTABanner onQuoteOpen={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
