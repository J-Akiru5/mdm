"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  { href: "/services", label: "SERVICES" },
  { href: "/portfolio", label: "PORTFOLIO" },
  { href: "/contact", label: "CONTACT" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openQuoteModal = () => {
    setMenuOpen(false);
    // Dispatch custom event for pages to listen to
    window.dispatchEvent(new CustomEvent("openQuoteModal"));
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Brand/Logo */}
        <Link href="/" className={styles.logo} aria-label="MDM Events Management Home">
          <Image
            src="/logo/mdm_logo.png"
            alt="MDM Events Management Logo"
            width={102}
            height={58}
            className={styles.logoImg}
            priority
          />
        </Link>

        {/* Menu Toggle (Hamburger) for mobile */}
        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        {/* Nav links and CTA button */}
        <nav
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button className={`${styles.btn} ${styles.btnSmall}`} onClick={openQuoteModal}>
            GET A QUOTE
          </button>
        </nav>
      </div>
    </header>
  );
}
