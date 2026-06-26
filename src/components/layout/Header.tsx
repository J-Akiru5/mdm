'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT US' },
  { href: '/services', label: 'SERVICES' },
  { href: '/portfolio', label: 'PORTFOLIO' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const openQuoteModal = () => {
    setMenuOpen(false);
    // Dispatch custom event for pages to listen to
    window.dispatchEvent(new CustomEvent('openQuoteModal'));
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="MDM Events Management Home">
            <Image
              src="/logo/mdm_logo.png"
              alt="MDM Events Management Logo"
              width={88}
              height={50}
              className={styles.logoImg}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Button */}
          <div className={styles.desktopCta}>
            <button className={styles.quoteBtn} onClick={openQuoteModal} id="header-quote-btn">
              GET A QUOTE
            </button>
          </div>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Mobile navigation">
        <ul className={styles.navList}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.mobileCta}>
          <button className={styles.quoteBtn} onClick={openQuoteModal}>GET A QUOTE</button>
        </div>
      </nav>
    </>
  );
}
