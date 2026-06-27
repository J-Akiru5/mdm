"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function AdminDashboard() {
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.portfolioCount !== undefined) setPortfolioCount(data.portfolioCount);
        if (data.inquiryCount !== undefined) setInquiryCount(data.inquiryCount);
        if (data.feedbackCount !== undefined) setFeedbackCount(data.feedbackCount);
      });
  }, []);

  return (
    <div>
      <h1 className={styles.heading}>Dashboard</h1>
      <div className={styles.grid}>
        <Link href="/admin/portfolio" className={styles.card}>
          <span className={styles.cardValue}>{portfolioCount}</span>
          <span className={styles.cardLabel}>Portfolio Items</span>
        </Link>
        <Link href="/admin/inquiries" className={styles.card}>
          <span className={styles.cardValue}>{inquiryCount}</span>
          <span className={styles.cardLabel}>Inquiries</span>
        </Link>
        <Link href="/admin/feedback" className={styles.card}>
          <span className={styles.cardValue}>{feedbackCount}</span>
          <span className={styles.cardLabel}>Feedback</span>
        </Link>
      </div>
    </div>
  );
}
