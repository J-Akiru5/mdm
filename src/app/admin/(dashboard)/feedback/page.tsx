"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Pagination from "@/components/ui/Pagination";
import styles from "./page.module.css";

interface Feedback {
  id: string;
  name: string;
  email: string;
  company: string | null;
  rating: number;
  comment: string;
  is_visible: boolean;
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
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [page, setPage] = useState(1);

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchFeedbacks = useCallback(
    async (p: number, search: string, rating: string, visibility: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(p));
        params.set("limit", String(PAGE_SIZE));
        if (search) params.set("search", search);
        if (rating !== "all") params.set("rating", rating);
        if (visibility !== "all") params.set("visibility", visibility);

        const r = await fetch(`/api/feedback?${params.toString()}`);
        if (!r.ok) throw new Error("Failed");
        const json: FeedbackResponse = await r.json();
        setRes(json);
      } catch {
        setRes(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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
    fetchFeedbacks(page, debouncedSearch, filterRating, filterVisibility);
  }, [page, debouncedSearch, filterRating, filterVisibility, fetchFeedbacks]);

  const handleFilterRating = (val: string) => {
    setFilterRating(val);
    setPage(1);
  };

  const handleFilterVisibility = (val: string) => {
    setFilterVisibility(val);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterRating("all");
    setFilterVisibility("all");
    setPage(1);
  };

  const toggleVisibility = async (fb: Feedback) => {
    try {
      const r = await fetch("/api/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: fb.id, is_visible: !fb.is_visible }),
      });
      if (!r.ok) throw new Error("Failed");
      if (selected?.id === fb.id) {
        setSelected({ ...selected, is_visible: !fb.is_visible });
      }
      setRes((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((f) => (f.id === fb.id ? { ...f, is_visible: !fb.is_visible } : f)),
        };
      });
    } catch {
      alert("Failed to update visibility.");
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm("Delete this feedback entry?")) return;
    try {
      const r = await fetch(`/api/feedback?id=${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Failed");
      if (selected?.id === id) setSelected(null);
      setRes((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          total: prev.total - 1,
          data: prev.data.filter((f) => f.id !== id),
        };
      });
    } catch {
      alert("Failed to delete feedback.");
    }
  };

  const hasActiveFilters = searchQuery || filterRating !== "all" || filterVisibility !== "all";
  const feedbacks = res?.data ?? [];
  const visibleCount = res ? res.data.filter((f) => f.is_visible).length : 0;
  const hiddenCount = feedbacks.length - visibleCount;

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
                <strong>Company</strong>
                <p>{selected.company || "—"}</p>
              </div>
              <div>
                <strong>Rating</strong>
                <p className={styles.stars}>
                  {"★".repeat(selected.rating)}
                  {"☆".repeat(5 - selected.rating)}
                </p>
              </div>
              <div>
                <strong>Status</strong>
                <p>
                  <span
                    className={selected.is_visible ? styles.statusApproved : styles.statusPending}
                  >
                    {selected.is_visible ? "Approved" : "Pending"}
                  </span>
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
            <div className={styles.detailActions}>
              <button
                className={selected.is_visible ? styles.detailBtnWarn : styles.detailBtnPrimary}
                onClick={() => {
                  toggleVisibility(selected);
                }}
              >
                {selected.is_visible ? "Revoke Approval" : "Approve for Site"}
              </button>
              <button
                className={styles.detailBtnDanger}
                onClick={() => {
                  const id = selected.id;
                  setSelected(null);
                  deleteFeedback(id);
                }}
              >
                Delete
              </button>
            </div>
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
          <span className={styles.summaryNumber}>
            {res ? res.data.filter((f) => f.is_visible).length : "—"}
          </span>
          <span className={styles.summaryLabel}>Approved</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryNumber}>
            {res ? res.data.filter((f) => !f.is_visible).length : "—"}
          </span>
          <span className={styles.summaryLabel}>Pending</span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, email, company, or comment…"
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
        <select
          value={filterVisibility}
          onChange={(e) => handleFilterVisibility(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="visible">Approved</option>
          <option value="hidden">Pending</option>
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
              <div
                key={fb.id}
                className={`${styles.item} ${!fb.is_visible ? styles.itemPending : ""}`}
                onClick={() => setSelected(fb)}
              >
                <div className={styles.itemMain}>
                  <div className={styles.itemInfo}>
                    <strong>{fb.name}</strong>
                    <span className={styles.itemEmail}>{fb.email}</span>
                    <span className={styles.itemStars}>
                      {"★".repeat(fb.rating)}
                      {"☆".repeat(5 - fb.rating)}
                    </span>
                  </div>
                  <span className={fb.is_visible ? styles.badgeApproved : styles.badgePending}>
                    {fb.is_visible ? "Approved" : "Pending"}
                  </span>
                </div>
                <div className={styles.itemActions}>
                  <button
                    className={styles.actionBtn}
                    title={fb.is_visible ? "Revoke approval" : "Approve for site"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(fb);
                    }}
                  >
                    {fb.is_visible ? "✕" : "✓"}
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.actionDelete}`}
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFeedback(fb.id);
                    }}
                  >
                    🗑
                  </button>
                  <span className={styles.itemDate}>
                    {new Date(fb.created_at).toLocaleDateString()}
                  </span>
                </div>
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
