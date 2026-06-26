"use client";
import { useEffect, useState } from "react";
import Button from "./Button";
import styles from "./QuoteModal.module.css";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setShowThankYou(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowThankYou(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>

        {showThankYou ? (
          <div className={styles.thankYou}>
            <span className={styles.thankYouIcon}>✓</span>
            <h3 className={styles.thankYouTitle}>Thank You!</h3>
            <p>We&apos;ll get back to you shortly.</p>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Get a Quote</h2>
            <p className={styles.description}>
              Tell us about your event and we&apos;ll create a custom proposal.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={styles.input}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.row}>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className={styles.input}
                />
                <input
                  type="text"
                  placeholder="Company / Organization"
                  className={styles.input}
                />
              </div>
              <div className={styles.row}>
                <select className={styles.input} defaultValue="">
                  <option value="" disabled>
                    Event Type
                  </option>
                  <option value="corporate">Corporate Event</option>
                  <option value="government">Government Event</option>
                  <option value="launch">Brand Launch</option>
                  <option value="festival">Festival</option>
                  <option value="exhibit">Exhibit / Trade Fair</option>
                  <option value="other">Other</option>
                </select>
                <input type="date" className={styles.input} />
              </div>
              <textarea
                placeholder="Tell us about your event..."
                className={styles.textarea}
                rows={4}
              ></textarea>
              <Button type="submit" className={styles.submit}>
                Send Request
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
