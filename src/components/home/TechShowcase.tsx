import { techServices, techUsp } from "@/data/services/techServices";
import SectionHeading from "../ui/SectionHeading";
import ScrollReveal from "../ui/ScrollReveal";
import styles from "./TechShowcase.module.css";

const techIcons: Record<string, string> = {
  "Event Registration & Ticketing Systems": "🎟️",
  "QR Code & RFID Attendance": "📱",
  "Event Websites & Landing Pages": "🌐",
  "Mobile Event Applications": "📲",
  "AI Chatbots & Virtual Assistants": "🤖",
  "Livestream & Hybrid Event Platforms": "🎥",
  "LED Walls & Digital Signage": "🖥️",
  "Audio-Visual & Presentation Systems": "🔊",
  "Wi-Fi & Network Infrastructure": "📡",
  "Computers, Tablets & Device Rentals": "💻",
  "Interactive Kiosks": "🖲️",
  "Custom Software Development": "⚙️",
  "Technical Support & Help Desk": "🛠️",
};

export default function TechShowcase() {
  return (
    <section className={styles.section}>
      <div className="container-wide">
        <SectionHeading
          subtitle="Powered by Technology"
          title="Digital Solutions & Capabilities"
          description={techUsp}
          dark
          align="center"
        />

        <p className={styles.positioning}>
          MDM integrates technology into every service we deliver — from AI-powered automation and
          custom web platforms to professional media production and data analytics. Technology is
          not an afterthought — it is embedded in every project we deliver.
        </p>

        <div className={styles.grid}>
          {techServices.map((svc, i) => (
            <ScrollReveal key={svc.title} delay={i * 0.05}>
              <div className={styles.card}>
                <span className={styles.icon}>{techIcons[svc.title] || "⚡"}</span>
                <h3 className={styles.cardTitle}>{svc.title}</h3>
                <p className={styles.cardDesc}>{svc.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
