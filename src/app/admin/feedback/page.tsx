"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Pagination from "@/components/ui/Pagination";
import styles from "./page.module.css";

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface FeedbackResponse {
  data: Feedback[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

const PAGE_SIZE = 20;

export default function AdminFeedback() {
  const [res, setRes] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Feedback | null>(null);

  // Filters & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [page, setPage] = useState(1);

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchFeedbacks = useCallback(async (p: number, search: string, rating: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(PAGE_SIZE));
      if (search) params.set("search", search);
      if (rating !== "all") params.set("rating", rating);

      const r = await fetch(`/api/feedback?${params.toString()}`);
      if (!r.ok) throw new Error("Failed");
      const json: FeedbackResponse = await r.json();
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
    fetchFeedbacks(page, debouncedSearch, filterRating);
  }, [page, debouncedSearch, filterRating, fetchFeedbacks]);

  const handleFilterRating = (val: string) => {
    setFilterRating(val);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterRating("all");
    setPage(1);
  };

  const hasActiveFilters = searchQuery || filterRating !== "all";
  const feedbacks = res?.data ?? [];

  // Compute summary from all (API-side total, avg only from current page)
  const pageAvg =
    feedbacks.length > 0
      ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
      : "—";

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Feedback</h1>
        {res && <span className={styles.totalCount}>{res.total.toLocaleString()} total</span>}
      </div>

      {/* Detail Modal */}
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

      {/* Summary cards */}
      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryNumber}>{res?.total ?? "—"}</span>
          <span className={styles.summaryLabel}>Total Feedback</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryNumber}>{pageAvg}</span>
          <span className={styles.summaryLabel}>Avg Rating (this page)</span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, email, or comment…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterRating}
          onChange={(e) => handleFilterRating(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
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
      ) : !res || feedbacks.length === 0 ? (
        <p className={styles.empty}>
          {hasActiveFilters ? "No feedback matches your filters." : "No feedback yet."}
        </p>
      ) : (
        <>
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
                <span className={styles.itemDate}>
                  {new Date(fb.created_at).toLocaleDateString()}
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
