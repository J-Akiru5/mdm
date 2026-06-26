import Image from "next/image";
import styles from "./Affiliations.module.css";

const affiliations = [
  {
    name: "Villa Darroca Rental Services",
    logo: "/images/affiliations/villa_darroca.png",
  },
  {
    name: "Southeast Property Management",
    logo: "/images/affiliations/southeast_pm.png",
  },
  {
    name: "CAM Design Group",
    logo: "/images/affiliations/cdg.png",
  },
  {
    name: "Berdeo",
    logo: "/images/affiliations/berdeo.png",
  },
  {
    name: "Cafe Gloria",
    logo: "/images/affiliations/cafe_gloria.png",
  },
];

export default function Affiliations() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Partners &amp; Direct Affiliates</span>
          <h2 className={styles.title}>Our Affiliations</h2>
          <p className={styles.subtitle}>
            We work closely with trusted partners across hospitality, real estate, design, and
            lifestyle to deliver seamless, end-to-end event experiences.
          </p>
        </div>

        <div className={styles.grid}>
          {affiliations.map((affil) => (
            <div key={affil.name} className={styles.card}>
              <div className={styles.logoWrap}>
                <Image
                  src={affil.logo}
                  alt={`${affil.name} logo`}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="200px"
                  unoptimized
                />
              </div>
              <p className={styles.name}>{affil.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
