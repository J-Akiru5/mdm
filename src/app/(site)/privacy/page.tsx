import HeroGlobe from "@/components/ui/HeroGlobe";
import styles from "./page.module.css";

export const metadata = {
  title: "Privacy Policy | MDM Events Management",
  description:
    "Learn how MDM Events Management collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className={`${styles.hero} brandedHero`}>
        <HeroGlobe />
        <div className="container heroContent" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>LEGAL</span>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.document}>
            <p>Last Updated: June 27, 2026</p>
            <p>
              At MDM Events Management, we respect your privacy and are committed to protecting the
              personal information you share with us. This Privacy Policy outlines how we collect,
              use, disclose, and safeguard your details when you visit our website or use our
              services.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We may collect personal information that you provide to us directly through contact
              forms, inquiry submissions, feedback forms, and event registration. This includes:
            </p>
            <ul>
              <li>Contact Details (Name, Email Address, Phone Number, Mailing Address)</li>
              <li>Company or Organization Name</li>
              <li>
                Event details (Event Type, Event Date, budget range, and special requirements)
              </li>
              <li>User Feedback and testimonial reviews</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information for purposes such as:</p>
            <ul>
              <li>Providing and managing event planning and execution services.</li>
              <li>Responding to inquiries, quotes, and event design requests.</li>
              <li>Processing customer feedback to improve our event coordination.</li>
              <li>
                Sending updates, promotions, or administrative announcements related to our
                services.
              </li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            <p>
              We do not sell or lease your personal information. We may share your data with trusted
              third-party vendors (such as catering services, sound and lighting providers, and
              venue managers) strictly as needed to coordinate and carry out your events.
            </p>

            <h2>4. Security of Your Data</h2>
            <p>
              We implement appropriate technical and organizational measures to ensure a level of
              security appropriate to the risk of unauthorized access, alteration, disclosure, or
              destruction of your personal information.
            </p>

            <h2>5. Your Choices and Rights</h2>
            <p>
              Depending on your location, you may have the right to request access to, correction
              of, or deletion of the personal data we hold. If you have any inquiries regarding your
              data, please contact us at mdmeventsmgt@gmail.com.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
