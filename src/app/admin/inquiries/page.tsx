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

const eventTypes = ["corporate", "government", "launch", "festival", "exhibit", "other"];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEventType, setFilterEventType] = useState("all");

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInquiries(data);
        setLoading(false);
      });
  }, []);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.message && inq.message.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEventType = filterEventType === "all" || inq.event_type === filterEventType;
    return matchesSearch && matchesEventType;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setFilterEventType("all");
  };

  const hasActiveFilters = searchQuery || filterEventType !== "all";

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

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, email, company, or message..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterEventType}
          onChange={(e) => setFilterEventType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Event Types</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        {hasActiveFilters && (
          <button className={styles.clearFilters} onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {filteredInquiries.length === 0 && (
        <p className={styles.empty}>
          {hasActiveFilters ? "No inquiries match your filters." : "No inquiries yet."}
        </p>
      )}

      <div className={styles.list}>
        {filteredInquiries.map((inq) => (
          <div key={inq.id} className={styles.item} onClick={() => setSelected(inq)}>
            <div className={styles.itemInfo}>
              <strong>{inq.full_name}</strong>
              <span className={styles.itemEmail}>{inq.email}</span>
              {inq.event_type && <span className={styles.itemBadge}>{inq.event_type}</span>}
            </div>
            <span className={styles.itemDate}>{new Date(inq.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
