"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  event_type: string;
  event_date: string;
  message: string;
  created_at: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInquiries(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div>
      <h1 className={styles.heading}>Inquiries</h1>

      {selected && (
        <div className={styles.detail} onClick={() => setSelected(null)}>
          <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeDetail} onClick={() => setSelected(null)}>
              ✕
            </button>
            <h2>{selected.full_name}</h2>
            <div className={styles.detailGrid}>
              <div>
                <strong>Email</strong>
                <p>{selected.email}</p>
              </div>
              <div>
                <strong>Phone</strong>
                <p>{selected.phone || "—"}</p>
              </div>
              <div>
                <strong>Company</strong>
                <p>{selected.company || "—"}</p>
              </div>
              <div>
                <strong>Event Type</strong>
                <p>{selected.event_type || "—"}</p>
              </div>
              <div>
                <strong>Event Date</strong>
                <p>{selected.event_date || "—"}</p>
              </div>
            </div>
            <div className={styles.detailMessage}>
              <strong>Message</strong>
              <p>{selected.message}</p>
            </div>
            <small className={styles.detailDate}>
              Received: {new Date(selected.created_at).toLocaleString()}
            </small>
          </div>
        </div>
      )}

      {inquiries.length === 0 && <p className={styles.empty}>No inquiries yet.</p>}
      <div className={styles.list}>
        {inquiries.map((inq) => (
          <div key={inq.id} className={styles.item} onClick={() => setSelected(inq)}>
            <div className={styles.itemInfo}>
              <strong>{inq.full_name}</strong>
              <span className={styles.itemEmail}>{inq.email}</span>
            </div>
            <span className={styles.itemDate}>{new Date(inq.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
