import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/Button';
import ScrollReveal from '../ui/ScrollReveal';
import styles from './AboutPreview.module.css';

export default function AboutPreview() {
  return (
    <section className="section section-off-white">
      <div className="container">
        <div className={styles.grid}>
          <ScrollReveal animation="fadeInLeft">
            <div className={styles.textContent}>
              <span className={styles.subtitle}>WHO WE ARE</span>
              <h2 className={styles.title}>
                Your Event.<br />
                <span className={styles.accent}>Professionally Handled.</span>
              </h2>
              <p className={styles.description}>
                MDM Events Management is a full-service events and activation partner that turns
                ideas into well-executed experiences. From corporate conferences and government
                programs to product launches, festivals, exhibits, and community celebrations,
                we manage every moving part.
              </p>
              <p className={styles.description}>
                Our clients can focus on their guests, message, and goals — while we handle everything else.
              </p>
              <Button variant="outlineDark" as="a" href="/about">
                Learn More About Us
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeInRight">
            <div className={styles.imageGrid}>
              <div className={styles.imageMain}>
                <Image
                  src="/images/portfolio/corporate.jpg"
                  alt="MDM Events - Corporate Event"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width:768px) 100vw, 40vw"
                  unoptimized
                />
              </div>
              <div className={styles.imageSub1}>
                <Image
                  src="/images/portfolio/festival.jpg"
                  alt="MDM Events - Festival"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width:768px) 50vw, 20vw"
                  unoptimized
                />
              </div>
              <div className={styles.imageSub2}>
                <Image
                  src="/images/portfolio/launch.jpg"
                  alt="MDM Events - Product Launch"
                  fill
                  style={{ objectFit: 'cover' }}
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
