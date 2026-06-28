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
                MDM Events Management combines strategic planning, creative execution, and
                technology-driven solutions to produce memorable experiences for corporations,
                government agencies, brands, and communities.
              </p>
              <p className={styles.description}>
                Unlike traditional event companies, MDM integrates full-stack technology —
                registration systems, event apps, AI assistants, livestreaming, and custom software
                — directly into every project, giving clients a single, accountable partner from
                concept to post-event analytics.
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
