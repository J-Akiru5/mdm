import { testimonials } from "@/data/testimonials";
import SectionHeading from "../ui/SectionHeading";
import ScrollReveal from "../ui/ScrollReveal";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
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
                <p className={styles.quote}>{t.quote}</p>
                <div className={styles.author}>
                  <strong className={styles.name}>{t.name}</strong>
                  <span className={styles.role}>
                    {t.title}, {t.company}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
