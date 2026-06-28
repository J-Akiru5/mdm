"use client";

import { useEffect, useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import ScrollReveal from "../ui/ScrollReveal";
import styles from "./Testimonials.module.css";

interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  rating: number;
  comment: string;
  created_at: string;
}

const fallbackTestimonials: TestimonialItem[] = [
  {
    id: "01",
    name: "Maria Santos",
    company: "Megaworld Corporation",
    rating: 5,
    comment:
      "MDM handled our annual corporate conference with exceptional professionalism. The registration system alone saved us hours of manual work, and the on-site coordination was flawless.",
    created_at: new Date().toISOString(),
  },
  {
    id: "02",
    name: "Juan Dela Cruz",
    company: "Grab Philippines",
    rating: 5,
    comment:
      "From concept to execution, MDM delivered a brand activation that exceeded our expectations. Their technology integration made our campaign truly interactive.",
    created_at: new Date().toISOString(),
  },
  {
    id: "03",
    name: "Anna Reyes",
    company: "GIZ Philippines",
    rating: 5,
    comment:
      "We partnered with MDM for a government summit and were impressed by their end-to-end capability. The livestream setup allowed thousands of virtual participants to join seamlessly.",
    created_at: new Date().toISOString(),
  },
];

export default function Testimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feedback/public")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        if (json.data && json.data.length > 0) {
          setItems(json.data);
        } else {
          setItems(fallbackTestimonials);
        }
      })
      .catch(() => setItems(fallbackTestimonials))
      .finally(() => setLoading(false));
  }, []);

  const testimonials = loading ? fallbackTestimonials : items;

  return (
    <section className={styles.section}>
      <div className="container-wide">
        <SectionHeading subtitle="Testimonials" title="What Our Clients Say." align="center" />
        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.15}>
              <div className={styles.card}>
                <div className={styles.quoteIcon} aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className={styles.quote}>{t.comment}</p>
                <div className={styles.author}>
                  <strong className={styles.name}>{t.name}</strong>
                  {t.company && <span className={styles.role}>{t.company}</span>}
                </div>
                <div className={styles.stars}>
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
