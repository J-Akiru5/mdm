"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Pagination from "@/components/ui/Pagination";
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

interface InquiryResponse {
  data: Inquiry[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

const PAGE_SIZE = 20;
const eventTypes = ["corporate", "government", "launch", "festival", "exhibit", "other"];

export default function AdminInquiries() {
  const [res, setRes] = useState<InquiryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  // Filters & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEventType, setFilterEventType] = useState("all");
  const [page, setPage] = useState(1);

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchInquiries = useCallback(async (p: number, search: string, eventType: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(PAGE_SIZE));
      if (search) params.set("search", search);
      if (eventType !== "all") params.set("eventType", eventType);

      const r = await fetch(`/api/contact?${params.toString()}`);
      if (!r.ok) throw new Error("Failed");
      const json: InquiryResponse = await r.json();
      setRes(json);
    } catch {
      setRes(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchQuery]);

  // Fetch when deps change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInquiries(page, debouncedSearch, filterEventType);
  }, [page, debouncedSearch, filterEventType, fetchInquiries]);

  const handleFilterEventType = (val: string) => {
    setFilterEventType(val);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterEventType("all");
    setPage(1);
  };

  const hasActiveFilters = searchQuery || filterEventType !== "all";
  const inquiries = res?.data ?? [];

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Inquiries</h1>
        {res && <span className={styles.totalCount}>{res.total.toLocaleString()} total</span>}
      </div>

      {/* Detail Modal */}
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

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, email, company, or message…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterEventType}
          onChange={(e) => handleFilterEventType(e.target.value)}
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

      {/* List */}
      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : !res || inquiries.length === 0 ? (
        <p className={styles.empty}>
          {hasActiveFilters ? "No inquiries match your filters." : "No inquiries yet."}
        </p>
      ) : (
        <>
          <div className={styles.list}>
            {inquiries.map((inq) => (
              <div key={inq.id} className={styles.item} onClick={() => setSelected(inq)}>
                <div className={styles.itemInfo}>
                  <strong>{inq.full_name}</strong>
                  <span className={styles.itemEmail}>{inq.email}</span>
                  {inq.event_type && <span className={styles.itemBadge}>{inq.event_type}</span>}
                </div>
                <span className={styles.itemDate}>
                  {new Date(inq.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>

          <Pagination
            page={res.page}
            totalPages={res.totalPages}
            total={res.total}
            pageSize={res.pageSize}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
