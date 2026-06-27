import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import styles from "./AffiliationsGrid.module.css";

const affiliations = [
  {
    name: "Villa Darroca Rental Services",
    logo: "/images/affiliations/villa-darroca.png",
  },
  {
    name: "Southeast Property Management",
    logo: "/images/affiliations/southeast.png",
  },
  {
    name: "CAM Design Group",
    logo: "/images/affiliations/cdg.png",
  },
  {
    name: "Berde",
    logo: "/images/affiliations/berde.png",
  },
  {
    name: "Cafe Gloria",
    logo: "/images/affiliations/cafe-gloria.png",
  },
];

export default function AffiliationsGrid() {
  return (
    <section className={styles.section}>
      {/* Ambient radial glow behind heading */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className="container">
        {/* Custom heading — dark-optimised */}
        <div className={styles.heading}>
          <span className={styles.subtitle}>Our Network</span>
          <h2 className={styles.title}>Our Affiliations</h2>
          <p className={styles.description}>
            Proud to be partnered with trusted businesses and organisations that share our
            commitment to excellence.
          </p>
        </div>

        {/* 5-card grid: 3 top + 2 bottom centered via 6-col CSS trick */}
        <div className={styles.grid}>
          {affiliations.map((affiliate, i) => (
            <ScrollReveal key={affiliate.name} delay={i * 0.12}>
              <div className={styles.card}>
                {/* Hover glow layer */}
                <div className={styles.cardGlow} aria-hidden="true" />

                <div className={styles.logoWrap}>
                  <Image
                    src={affiliate.logo}
                    alt={`${affiliate.name} logo`}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 768px) 50vw, 220px"
                    unoptimized
                  />
                </div>

                <div className={styles.divider} aria-hidden="true" />
                <p className={styles.name}>{affiliate.name}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
