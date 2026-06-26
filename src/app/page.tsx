"use client";

import { useState } from "react";
import QuoteModal from "@/components/ui/QuoteModal";
import HeroSection from "@/components/home/HeroSection";
import ClientMarquee from "@/components/home/ClientMarquee";
import CoreValues from "@/components/home/CoreValues";
import AboutPreview from "@/components/home/AboutPreview";
import WhatWeDo from "@/components/home/WhatWeDo";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import CTABanner from "@/components/home/CTABanner";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <>
      <HeroSection onQuoteOpen={() => setQuoteOpen(true)} />
      <ClientMarquee />
      <CoreValues />
      <AboutPreview />
      <WhatWeDo onQuoteOpen={() => setQuoteOpen(true)} />
      <PortfolioPreview />
      <CTABanner onQuoteOpen={() => setQuoteOpen(true)} />
      <ContactSection />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
