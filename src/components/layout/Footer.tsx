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
  { href: "/services", label: "Event Planning" },
  { href: "/services", label: "Event Production" },
  { href: "/services", label: "Event Management" },
  { href: "/services", label: "Branding & Design" },
];

const socialLinks = [
  { href: "#", label: "Facebook", icon: "FB" },
  { href: "#", label: "Instagram", icon: "IG" },
  { href: "#", label: "YouTube", icon: "YT" },
  { href: "#", label: "TikTok", icon: "TT" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo/mdm_logo.png"
                alt="MDM Events Management Logo"
                width={106}
                height={60}
                className={styles.logoImg}
              />
            </Link>
            <p className={styles.tagline}>
              Professional event planning, production, and management services.
              We bring your vision to life.
            </p>
            <div className={styles.social}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.socialLink}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
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
            <h4 className={styles.columnTitle}>Contact Info</h4>
            <ul className={styles.columnLinks}>
              <li>Iloilo City, Philippines</li>
              <li>
                <a href="tel:+639123456789">+63 (912) 345 6789</a>
              </li>
              <li>
                <a href="mailto:info@mdmevents.com">info@mdmevents.com</a>
              </li>
              <li>Mon–Fri: 9:00 AM – 6:00 PM</li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} MDM Events Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
