import HeroGlobe from "@/components/ui/HeroGlobe";
import styles from "./page.module.css";

export const metadata = {
  title: "Terms of Service | MDM Events Management",
  description:
    "Read the Terms of Service for using the website and services of MDM Events Management.",
};

export default function TermsPage() {
  return (
    <>
      <section className={`${styles.hero} brandedHero`}>
        <HeroGlobe />
        <div className="container heroContent" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>LEGAL</span>
          <h1 className={styles.heroTitle}>Terms of Service</h1>
        </div>
      </section>

      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.document}>
            <p>Last Updated: June 27, 2026</p>
            <p>
              Welcome to MDM Events Management. By accessing or using our website and services, you
              agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By visiting our site or acquiring our services, you engage in our &quot;Service&quot;
              and agree to be bound by the following terms and conditions. If you do not agree to
              all terms, you may not access the website or use any services.
            </p>

            <h2>2. Scope of Services</h2>
            <p>
              MDM Events Management offers planning, styling, catering coordination, venue booking,
              and full production services for corporate events, brand launches, and community
              gatherings. All quotes, conceptual designs, and schedules are tentative until a formal
              contract is mutually signed and deposit requirements are fulfilled.
            </p>

            <h2>3. User Responsibilities</h2>
            <p>
              You agree to provide accurate, current, and complete information when submitting
              inquiries, event details, or feedback. You are responsible for ensuring that any
              assets or files you provide do not violate the copyright or intellectual property
              rights of any third party.
            </p>

            <h2>4. Intellectual Property</h2>
            <p>
              All concepts, designs, mockups, images, and brand materials created by MDM Events
              Management remain our intellectual property unless explicitly transferred under a
              written agreement. Use of our designs or concepts without authorization is strictly
              prohibited.
            </p>

            <h2>5. Limitation of Liability</h2>
            <p>
              MDM Events Management shall not be liable for any direct, indirect, incidental, or
              consequential damages resulting from the use or inability to use our services, or due
              to cancellations, delays, or conditions beyond our reasonable control (force majeure).
            </p>

            <h2>6. Governing Law</h2>
            <p>
              These Terms of Service and any separate agreements shall be governed by and construed
              in accordance with the laws of the Republic of the Philippines.
            </p>

            <h2>7. Contact Information</h2>
            <p>
              If you have any questions or feedback about these Terms of Service, please email us at
              mdmeventsmgt@gmail.com.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
