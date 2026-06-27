"use client";
import { useEffect, useCallback, useState } from "react";
import Button from "./Button";
import styles from "./QuoteModal.module.css";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({ isOpen, onClose }: QuoteModalProps) {
  const [showThankYou, setShowThankYou] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    eventType: "",
    eventDate: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClose = useCallback(() => {
    setShowThankYou(false);
    setForm({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      eventType: "",
      eventDate: "",
      message: "",
    });
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to send. Please try again.");
        setSubmitting(false);
        return;
      }

      setShowThankYou(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch {
      alert("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={handleClose} aria-label="Close">
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
                  name="fullName"
                  placeholder="Full Name"
                  className={styles.input}
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className={styles.input}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.row}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className={styles.input}
                  value={form.phone}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company / Organization"
                  className={styles.input}
                  value={form.company}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.row}>
                <select
                  name="eventType"
                  className={styles.input}
                  value={form.eventType}
                  onChange={handleChange}
                >
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
                <input
                  type="date"
                  name="eventDate"
                  className={styles.input}
                  value={form.eventDate}
                  onChange={handleChange}
                />
              </div>
              <textarea
                name="message"
                placeholder="Tell us about your event..."
                className={styles.textarea}
                rows={4}
                value={form.message}
                onChange={handleChange}
              ></textarea>
              <Button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? "Sending..." : "Send Request"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
