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
  { href: "/services", label: "Corporate Events" },
  { href: "/services", label: "Brand Activations" },
  { href: "/services", label: "Production & Technical" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo/mdm_logo.jpg"
                alt="MDM Events Management Logo"
                width={106}
                height={60}
                className={styles.logoImg}
              />
            </Link>
            <p className={styles.tagline}>Events That Move People, Brands, and Communities.</p>
          </div>

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

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <ul className={styles.columnLinks}>
              <li>mdmeventsmgt@gmail.com</li>
              <li>+63 908 895 4818</li>
              <li>(033) 323 4864</li>
              <li>56 Quezon St. Arevalo, Iloilo City</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.copyrightGroup}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} MDM Events Management. All Rights Reserved.
            </p>
            <div className={styles.legalLinks}>
              <Link href="/privacy">Privacy Policy</Link>
              <span className={styles.legalDivider}>&bull;</span>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
          <div className={styles.creditPill}>
            <span>Powered by</span>{" "}
            <a href="https://zenlabs.me/" target="_blank" rel="noopener noreferrer">
              ZenLabs
            </a>
            <span className={styles.creditDivider}>|</span>
            <span>Built with</span>{" "}
            <a href="https://www.syntaxure.dev/" target="_blank" rel="noopener noreferrer">
              Syntaxure Labs
            </a>
          </div>
        </div>
      </div>

      {/* Huge modern watermark background with sharp design styling */}
      <div className={styles.watermark} aria-hidden="true">
        MDMevents
      </div>
    </footer>
  );
}
