"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Feedback | null>(null);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setFeedbacks(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div>
      <h1 className={styles.heading}>Feedback</h1>

      {selected && (
        <div className={styles.detail} onClick={() => setSelected(null)}>
          <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeDetail} onClick={() => setSelected(null)}>
              ✕
            </button>
            <h2>{selected.name}</h2>
            <div className={styles.detailGrid}>
              <div>
                <strong>Email</strong>
                <p>{selected.email}</p>
              </div>
              <div>
                <strong>Rating</strong>
                <p className={styles.stars}>
                  {"★".repeat(selected.rating)}
                  {"☆".repeat(5 - selected.rating)}
                </p>
              </div>
            </div>
            <div className={styles.detailMessage}>
              <strong>Comment</strong>
              <p>{selected.comment}</p>
            </div>
            <small className={styles.detailDate}>
              Received: {new Date(selected.created_at).toLocaleString()}
            </small>
          </div>
        </div>
      )}

      {feedbacks.length === 0 && <p className={styles.empty}>No feedback yet.</p>}

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryNumber}>{feedbacks.length}</span>
          <span className={styles.summaryLabel}>Total Feedback</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryNumber}>
            {feedbacks.length > 0
              ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
              : "—"}
          </span>
          <span className={styles.summaryLabel}>Average Rating</span>
        </div>
      </div>

      <div className={styles.list}>
        {feedbacks.map((fb) => (
          <div key={fb.id} className={styles.item} onClick={() => setSelected(fb)}>
            <div className={styles.itemInfo}>
              <strong>{fb.name}</strong>
              <span className={styles.itemEmail}>{fb.email}</span>
              <span className={styles.itemStars}>
                {"★".repeat(fb.rating)}
                {"☆".repeat(5 - fb.rating)}
              </span>
            </div>
            <span className={styles.itemDate}>{new Date(fb.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
