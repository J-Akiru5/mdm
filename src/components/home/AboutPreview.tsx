import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";
import styles from "./AboutPreview.module.css";

export default function AboutPreview() {
  return (
    <section id="about" className="section section-off-white">
      <div className="container-wide">
        <div className={styles.grid}>
          <ScrollReveal animation="fadeInLeft">
            <div className={styles.textContent}>
              <span className={styles.subtitle}>WHO WE ARE</span>
              <h2 className={styles.title}>
                Your Event.
                <br />
                <span className={styles.accent}>Professionally Handled.</span>
              </h2>
              <p className={styles.description}>
                MDM Events Management specializes in delivering high-impact corporate events that
                drive business results.
              </p>
              <p className={styles.description}>
                Our team of experts has 8 years of experience in crafting and executing events that
                exceed our clients&apos; expectations.
              </p>
              <Link href="/about" className={styles.textLink}>
                Learn More About Us →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeInRight">
            <div className={styles.photoGrid}>
              <div className={`${styles.photo} ${styles.photoMain}`}>
                <Image
                  src="/images/portfolio/corporate.jpg"
                  alt="MDM Events - Corporate Event"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width:768px) 100vw, 40vw"
                  unoptimized
                />
              </div>
              <div className={`${styles.photo} ${styles.photoSub1}`}>
                <Image
                  src="/images/portfolio/festival.jpg"
                  alt="MDM Events - Festival"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width:768px) 50vw, 20vw"
                  unoptimized
                />
              </div>
              <div className={`${styles.photo} ${styles.photoSub2}`}>
                <Image
                  src="/images/portfolio/launch.jpg"
                  alt="MDM Events - Product Launch"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width:768px) 50vw, 20vw"
                  unoptimized
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
