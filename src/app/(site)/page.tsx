"use client";

import { useState, useEffect } from "react";
import QuoteModal from "@/components/ui/QuoteModal";
import HeroSection from "@/components/home/HeroSection";
import ClientMarquee from "@/components/home/ClientMarquee";
import CoreValues from "@/components/home/CoreValues";
import StatsBar from "@/components/home/StatsBar";
import AboutPreview from "@/components/home/AboutPreview";
import WhatWeDo from "@/components/home/WhatWeDo";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import TechShowcase from "@/components/home/TechShowcase";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const handler = () => setQuoteOpen(true);
    window.addEventListener("openQuoteModal", handler);
    return () => window.removeEventListener("openQuoteModal", handler);
  }, []);

  return (
    <>
      <HeroSection onQuoteOpen={() => setQuoteOpen(true)} />
      <CoreValues />
      <ClientMarquee />
      <AboutPreview />
      <StatsBar />
      <WhatWeDo onQuoteOpen={() => setQuoteOpen(true)} />
      <TechShowcase />
      <Testimonials />
      <PortfolioPreview />
      <CTABanner onQuoteOpen={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
