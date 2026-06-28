import SectionHeading from "../ui/SectionHeading";
import styles from "./WhyChooseUs.module.css";

const reasons = [
  {
    number: "01",
    title: "One-Stop Event Solutions",
    description: "Planning, production, and technology from one team.",
  },
  {
    number: "02",
    title: "Technology-Driven Execution",
    description: "Proprietary tools and platforms built for events.",
  },
  {
    number: "03",
    title: "Experienced Project Managers",
    description: "8+ years of complex event delivery.",
  },
  {
    number: "04",
    title: "Reliable Supplier Network",
    description: "Vetted vendors across the Philippines.",
  },
  {
    number: "05",
    title: "Nationwide Capability",
    description: "Events in Iloilo, Manila, Cebu, and beyond.",
  },
  {
    number: "06",
    title: "Dedicated On-Site Support",
    description: "MDM team present from setup to teardown.",
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
