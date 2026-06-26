import SectionHeading from "../ui/SectionHeading";
import styles from "./WhyChooseUs.module.css";

const reasons = [
  {
    number: "01",
    title: "Personalized Service",
    description: "Tailored to your unique needs.",
  },
  {
    number: "02",
    title: "Creative Solutions",
    description: "Innovative event solutions that stand out.",
  },
  {
    number: "03",
    title: "Attention to Detail",
    description: "Meticulous planning and flawless execution.",
  },
  {
    number: "04",
    title: "Proven Track Record",
    description: "A history of successful events.",
  },
  {
    number: "05",
    title: "Strong Network",
    description: "Trusted suppliers and partners.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className={styles.section}>
      <div className="container">
        <SectionHeading subtitle="Our Edge" title="Why Choose Us" align="center" />
        <div className={styles.inner}>
          {reasons.map((reason) => (
            <div key={reason.number} className={styles.item}>
              <span className={styles.number}>{reason.number}</span>
              <div className={styles.content}>
                <h3 className={styles.title}>{reason.title}</h3>
                <p className={styles.text}>{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
