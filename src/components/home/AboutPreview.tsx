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
                Your Digital Partner.
                <br />
                <span className={styles.accent}>From Concept to Execution.</span>
              </h2>
              <p className={styles.description}>
                MDM Digital, Media & Technology Services empowers organizations to innovate,
                connect, and grow through technology, creativity, and digital transformation. We
                partner with associations, businesses, educational institutions, government
                agencies, nonprofits, and communities to build meaningful digital experiences.
              </p>
              <p className={styles.description}>
                From strategic planning and technology incubation to websites, multimedia
                production, AI solutions, and event technology, MDM delivers integrated services
                that help organizations thrive in the digital age.
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
                  src="/images/home/workshop-group.png"
                  alt="MDM Events - Regional Workshop Group Photo"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width:768px) 100vw, 40vw"
                  unoptimized
                />
              </div>
              <div className={`${styles.photo} ${styles.photoSub1}`}>
                <Image
                  src="/images/home/panel-discussion.png"
                  alt="MDM Events - Panel Discussion"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width:768px) 50vw, 20vw"
                  unoptimized
                />
              </div>
              <div className={`${styles.photo} ${styles.photoSub2}`}>
                <Image
                  src="/images/home/community-engagement.png"
                  alt="MDM Events - Community Engagement"
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
