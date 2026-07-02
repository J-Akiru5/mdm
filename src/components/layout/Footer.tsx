import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

const serviceLinks = [
  { href: "/services", label: "Digital Solutions" },
  { href: "/services", label: "Creative & Media" },
  { href: "/services", label: "Business & Technology" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Main content — full width with generous side padding */}
      <div className={styles.inner}>
        {/* Top grid */}
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo/mdm_logo.jpg"
                alt="MDM Digital, Media & Technology Services Logo"
                width={90}
                height={50}
                className={styles.logoImg}
              />
            </Link>
            <p className={styles.tagline}>From Ideas to Digital Impact.</p>
            <p className={styles.brandDesc}>
              Empowering organizations through technology, creativity, and digital transformation.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <ul className={styles.columnLinks}>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Services</h4>
            <ul className={styles.columnLinks}>
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <ul className={styles.columnLinks}>
              <li>
                <a href="mailto:hello@mdmevents.org">hello@mdmevents.org</a>
              </li>
              <li>
                <a href="tel:+639088954818">+63 908 895 4818</a>
              </li>
              <li>(033) 323 4864</li>
              <li>56 Quezon St. Arevalo, Iloilo City</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyrightGroup}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} MDM Digital, Media &amp; Technology Services. All
              Rights Reserved.
            </p>
            <div className={styles.legalLinks}>
              <Link href="/privacy">Privacy Policy</Link>
              <span className={styles.legalDivider}>&bull;</span>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>

          <div className={styles.creditPill}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>Powered by&nbsp;</span>
            <a href="https://zenlabs.me/" target="_blank" rel="noopener noreferrer">
              ZenLabs
            </a>
            <span className={styles.creditDivider}>|</span>
            <span>Built with&nbsp;</span>
            <a href="https://www.syntaxure.dev/" target="_blank" rel="noopener noreferrer">
              Syntaxure Labs
            </a>
          </div>
        </div>
      </div>

      {/* Full-width watermark — now truly edge-to-edge */}
      <div className={styles.watermark} aria-hidden="true">
        MDM Digital
      </div>
    </footer>
  );
}
