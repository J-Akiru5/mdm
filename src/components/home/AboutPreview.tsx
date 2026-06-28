import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";
import styles from "./AboutPreview.module.css";

const stats = [
  { value: "8+", label: "Years in\nBusiness" },
  { value: "200+", label: "Events\nProduced" },
  { value: "50+", label: "Clients\nServed" },
  { value: "100K+", label: "Attendees\nReached" },
  { value: "5+", label: "Cities\nCovered" },
];

export default function AboutPreview() {
  return (
    <section id="about" className="section section-off-white">
      <div className="container-wide">
        <div className={styles.grid}>
          <ScrollReveal animation="fadeInLeft">
            <div className={styles.photoWrapper}>
              <Image
                src="/images/home/team-collaboration.png"
                alt="MDM Events - Team Collaboration"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width:768px) 100vw, 50vw"
                unoptimized
              />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeInRight">
            <div className={styles.textContent}>
              <span className={styles.subtitle}>WHO WE ARE</span>
              <h2 className={styles.title}>
                Your Event. Professionally
                <br />
                <span className={styles.accent}>Handled.</span>
              </h2>
              <p className={styles.description}>
                MDM Events Management specializes in delivering high-impact corporate events that
                drive business results.
              </p>
              <p className={styles.description}>
                Our team of experts has 8 years of experience in crafting and executing events that
                exceed our clients&apos; expectations.
              </p>
              <div className={styles.stats}>
                {stats.map((stat) => (
                  <div key={stat.label} className={styles.statItem}>
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
