import Image from "next/image";
import styles from "./ClientMarquee.module.css";

const clients = [
  { name: "Megaworld Corporation", logo: "/images/clients/megaworld.svg" },
  { name: "Grab", logo: "/images/clients/grab.svg" },
  { name: "GIZ", logo: "/images/clients/giz.svg" },
  { name: "Pag-IBIG Fund", logo: "/images/clients/pagibig.svg" },
  { name: "SM Supermalls", logo: "/images/clients/sm_supermalls.svg" },
  { name: "Smirnoff", logo: "/images/clients/smirnoff.svg" },
  { name: "Reed Elsevier", logo: "/images/clients/reed_elsevier.svg" },
  { name: "DoubleDragon", logo: "/images/clients/doubledragon.svg" },
];

export default function ClientMarquee() {
  // Duplicate the list to ensure seamless infinite scroll
  const marqueeItems = [...clients, ...clients, ...clients];

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Trusted By Industry Leaders</h3>
      <div className={styles.marquee}>
        <div className={styles.marqueeInner}>
          {marqueeItems.map((client, index) => (
            <div key={`${client.name}-${index}`} className={styles.logoWrap}>
              <Image
                src={client.logo}
                alt={`${client.name} Logo`}
                width={140}
                height={50}
                className={styles.logo}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
