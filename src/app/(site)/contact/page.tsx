"use client";

import { useState, useEffect } from "react";
import QuoteModal from "@/components/ui/QuoteModal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import HeroGlobe from "@/components/ui/HeroGlobe";
import styles from "./page.module.css";

export default function ContactPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    message: "",
  });

  const [activeTab, setActiveTab] = useState<"inquiry" | "feedback">("inquiry");
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setQuoteOpen(true);
    window.addEventListener("openQuoteModal", handler);
    return () => window.removeEventListener("openQuoteModal", handler);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

      setSubmitted(true);
      setForm({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFeedbackForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackForm),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to submit feedback. Please try again.");
        setSubmittingFeedback(false);
        return;
      }

      setFeedbackSubmitted(true);
      setFeedbackForm({ name: "", email: "", rating: 5, comment: "" });
      setTimeout(() => setFeedbackSubmitted(false), 4000);
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className={`${styles.hero} brandedHero`}>
        <HeroGlobe />
        <div className="container heroContent" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>CONTACT US</span>
          <h1 className={styles.heroTitle}>Let&apos;s Create Something Amazing Together.</h1>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Contact Info */}
            <div className={styles.info}>
              <span className={styles.infoLabel}>GET IN TOUCH</span>
              <h2 className={styles.infoHeading}>We&apos;d love to hear from you.</h2>
              <p className={styles.infoDesc}>
                Tell us about your event and let&apos;s build something extraordinary together.
              </p>

              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrap}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.92 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012.83 1.2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.93a16 16 0 006.16 6.16l1.1-1.1a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.03z" />
                    </svg>
                  </div>
                  <div>
                    <p className={styles.infoTitle}>Phone</p>
                    <p className={styles.infoText}>
                      +63 908 895 4818
                      <br />
                      (033) 323-4864
                    </p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrap}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p className={styles.infoTitle}>Email</p>
                    <p className={styles.infoText}>mdmeventsmgt@gmail.com</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrap}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className={styles.infoTitle}>Address</p>
                    <p className={styles.infoText}>
                      Villa Darroca, 56 Quezon St. Arevalo, Iloilo City, Philippines
                    </p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrap}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <div>
                    <p className={styles.infoTitle}>Business Hours</p>
                    <p className={styles.infoText}>Mon–Sat: 8:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className={styles.socials}>
                {["facebook", "instagram", "youtube", "tiktok"].map((s) => (
                  <a key={s} href="#" className={styles.social} aria-label={s}>
                    <span className={styles.socialIcon}>
                      {s === "facebook" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                      )}
                      {s === "instagram" && (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      )}
                      {s === "youtube" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 00-1.95 1.95A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                          <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white" />
                        </svg>
                      )}
                      {s === "tiktok" && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.16 8.16 0 004.77 1.52V6.8a4.85 4.85 0 01-1-.11z" />
                        </svg>
                      )}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Form Section */}
            <div className={styles.formContainer}>
              <div className={styles.tabs}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "inquiry" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("inquiry")}
                >
                  Send Inquiry
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${activeTab === "feedback" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("feedback")}
                >
                  Leave Feedback
                </button>
              </div>

              {activeTab === "inquiry" ? (
                <form className={styles.form} onSubmit={handleSubmit}>
                  {submitted ? (
                    <div className={styles.successMsg}>
                      <span className={styles.successIcon}>✓</span>
                      <h3>Message Sent!</h3>
                      <p>We&apos;ll get back to you shortly.</p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="fullName">Full Name</label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Juan dela Cruz"
                            className={styles.input}
                            value={form.fullName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="company">Company / Organization</label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            placeholder="Company Name"
                            className={styles.input}
                            value={form.company}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="email">Email Address</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className={styles.input}
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="phone">Phone Number</label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+63 908 895 4818"
                            className={styles.input}
                            value={form.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="eventType">Event Type</label>
                          <select
                            id="eventType"
                            name="eventType"
                            className={styles.input}
                            value={form.eventType}
                            onChange={handleChange}
                          >
                            <option value="" disabled>
                              Select event type
                            </option>
                            <option value="corporate">Corporate Event</option>
                            <option value="government">Government Event</option>
                            <option value="launch">Brand Launch</option>
                            <option value="festival">Festival / Community</option>
                            <option value="exhibit">Exhibit / Trade Fair</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="eventDate">Event Date</label>
                          <input
                            id="eventDate"
                            name="eventDate"
                            type="date"
                            className={styles.input}
                            value={form.eventDate}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="message">Your Message</label>
                        <textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your event..."
                          className={styles.textarea}
                          rows={5}
                          value={form.message}
                          onChange={handleChange}
                        />
                      </div>
                      <Button type="submit" className={styles.submitBtn} disabled={submitting}>
                        {submitting ? "Sending..." : "Send Message"}
                      </Button>
                    </>
                  )}
                </form>
              ) : (
                <form className={styles.form} onSubmit={handleFeedbackSubmit}>
                  {feedbackSubmitted ? (
                    <div className={styles.successMsg}>
                      <span className={styles.successIcon}>✓</span>
                      <h3>Feedback Submitted!</h3>
                      <p>Thank you for your valuable feedback.</p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.formGroup}>
                        <label htmlFor="feedbackName">Name</label>
                        <input
                          id="feedbackName"
                          name="name"
                          type="text"
                          placeholder="Your Name"
                          className={styles.input}
                          value={feedbackForm.name}
                          onChange={handleFeedbackChange}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="feedbackEmail">Email Address</label>
                        <input
                          id="feedbackEmail"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className={styles.input}
                          value={feedbackForm.email}
                          onChange={handleFeedbackChange}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Rating</label>
                        <div className={styles.starsContainer}>
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled =
                              hoveredRating !== null
                                ? star <= hoveredRating
                                : star <= feedbackForm.rating;
                            return (
                              <button
                                key={star}
                                type="button"
                                className={`${styles.starBtn} ${isFilled ? styles.filled : ""}`}
                                onClick={() =>
                                  setFeedbackForm((prev) => ({ ...prev, rating: star }))
                                }
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(null)}
                                aria-label={`${star} Stars`}
                              >
                                <svg
                                  width="28"
                                  height="28"
                                  viewBox="0 0 24 24"
                                  fill={isFilled ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="comment">Comments / Feedback</label>
                        <textarea
                          id="comment"
                          name="comment"
                          placeholder="Share your thoughts or experience with us..."
                          className={styles.textarea}
                          rows={5}
                          value={feedbackForm.comment}
                          onChange={handleFeedbackChange}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={submittingFeedback}
                      >
                        {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                      </Button>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className={styles.mapSection}>
        <iframe
          src="https://maps.google.com/maps?q=Villa%20Darroca,%2056%20Quezon%20St.,%20Arevalo,%20Iloilo%20City,%20Philippines&t=&z=16&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="400"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="MDM Events Management Location - Iloilo City"
        />
      </section>

      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
