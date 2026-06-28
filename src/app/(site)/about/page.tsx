"use client";

import { useState, useEffect } from "react";
import QuoteModal from "@/components/ui/QuoteModal";
import SectionHeading from "@/components/ui/SectionHeading";
import StatCounter from "@/components/ui/StatCounter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { stats } from "@/data/stats";
import HeroGlobe from "@/components/ui/HeroGlobe";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AffiliationsGrid from "@/components/about/AffiliationsGrid";
import styles from "./page.module.css";

export default function AboutPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const handler = () => setQuoteOpen(true);
    window.addEventListener("openQuoteModal", handler);
    return () => window.removeEventListener("openQuoteModal", handler);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className={`${styles.hero} brandedHero`}>
        <HeroGlobe />
        <div className="container heroContent" style={{ textAlign: "center" }}>
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
                src="/images/home/team-collaboration.png"
                alt="MDM Events Management Team"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width:768px) 100vw, 50vw"
                unoptimized
              />
            </ScrollReveal>
            <ScrollReveal animation="fadeInRight" className={styles.textWrap}>
              <span className={styles.sectionLabel}>WHO WE ARE</span>
              <h2 className={styles.sectionHeading}>Your Event. Professionally Handled.</h2>
              <p className={styles.text}>
                MDM Events Management specializes in delivering high-impact corporate events that
                drive business results.
              </p>
              <p className={styles.text}>
                Our team of experts has 8 years of experience in crafting and executing events that
                exceed our clients&apos; expectations.
              </p>
              <div className={styles.statsRow}>
                {stats.map((stat) => (
                  <div key={stat.label} className={styles.miniStat}>
                    <span className={styles.miniStatValue}>
                      {stat.value}
                      {stat.suffix}
                    </span>
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

      {/* Leadership */}
      <section className={styles.leadershipSection}>
        <div className="container">
          <SectionHeading subtitle="Meet Our Founder" title="Our Leadership" align="center" />
          <div className={styles.leaderCard}>
            <ScrollReveal animation="fadeInLeft" className={styles.leaderImageWrap}>
              <Image
                src="/images/portfolio/profile.png"
                alt="Mary Ann Matiling"
                width={260}
                height={260}
                className={styles.leaderImage}
                unoptimized
              />
            </ScrollReveal>
            <ScrollReveal animation="fadeInRight" className={styles.leaderBio}>
              <h3 className={styles.leaderName}>Mary Ann Matiling</h3>
              <span className={styles.leaderRole}>Managing Director, MDM Events Management</span>
              <p className={styles.leaderText}>
                Mary Ann Matiling is a seasoned entrepreneur with a proven track record spanning
                over 20 years in various fields, including events management, business development,
                sales, marketing, and office administration. With her extensive experience, she has
                developed strong organizational skills, attention to detail, and the ability to
                multitask, making her a versatile professional.
              </p>
              <p className={styles.leaderText}>
                Ann has been managing events for over a decade; she oversees logistics, timelines,
                and client expectations with ease. In business development, she has a keen sense of
                market trends and opportunities, allowing her to drive growth and innovation.
                Ann&apos;s sales and marketing experience has given her an adept ability to build
                relationships. Additionally, her experience in office administration indicates she
                is well-versed in managing day-to-day operations, supervising teams, and ensuring a
                seamless workflow.
              </p>
            </ScrollReveal>
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
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h3 className={styles.missionTitle}>Our Mission</h3>
                <p className={styles.missionText}>
                  Our mission is to deliver innovative, professionally executed corporate events and
                  vibrant, culturally rich festivals that leave a lasting impact. We aim to bridge
                  brands with their audiences through strategic planning, creative storytelling, and
                  flawless execution—bringing every vision to life with Filipino heart and global
                  standards.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className={styles.missionCard}>
                <div className={styles.missionIconWrap}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className={styles.missionTitle}>Our Vision</h3>
                <p className={styles.missionText}>
                  To be the leading events management company in the Philippines, known for
                  delivering world-class corporate events and culturally vibrant festivals that
                  inspire, connect, and create lasting impact for brands, businesses, and
                  communities.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <AffiliationsGrid />

      <WhyChooseUs />

      {/* CTA */}
      <section className="section section-dark" style={{ textAlign: "center" }}>
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
