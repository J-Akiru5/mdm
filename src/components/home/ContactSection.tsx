"use client";

import { useState } from "react";
import styles from "./ContactSection.module.css";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({
        fullName: "",
        company: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container-wide">
        <div className={styles.grid}>
          <div className={styles.info}>
            <span className={styles.subtitle}>GET IN TOUCH</span>
            <h2 className={styles.title}>
              Let&apos;s Create Something
              <br />
              Amazing Together.
            </h2>
            <p className={styles.description}>Tell us about your event and how we can help.</p>
            <ul className={styles.details}>
              <li>
                <strong>Email</strong>
                <span>mdmeventsmgt@gmail.com</span>
              </li>
              <li>
                <strong>Mobile</strong>
                <span>+63 908 895 4818</span>
              </li>
              <li>
                <strong>Phone</strong>
                <span>(033) 323 4864</span>
              </li>
              <li>
                <strong>Address</strong>
                <span>56 Quezon St. Arevalo, Iloilo City</span>
              </li>
            </ul>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                required
                className={styles.input}
                value={formData.fullName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="company"
                placeholder="Company / Organization"
                className={styles.input}
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div className={styles.row}>
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                required
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                className={styles.input}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className={styles.row}>
              <input
                type="text"
                name="eventType"
                placeholder="Event Type"
                className={styles.input}
                value={formData.eventType}
                onChange={handleChange}
              />
              <input
                type="text"
                name="eventDate"
                placeholder="Event Date"
                className={styles.input}
                value={formData.eventDate}
                onChange={handleChange}
              />
            </div>
            <textarea
              name="message"
              placeholder="Tell us about your event: venue, number of guests, goals, etc."
              className={styles.textarea}
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : submitted ? "Message Sent!" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
