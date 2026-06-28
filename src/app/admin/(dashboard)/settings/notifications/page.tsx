"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import Pagination from "@/components/ui/Pagination";
import styles from "./page.module.css";

// ─── Feed tab types ──────────────────────────────────────────────────────────
interface FeedItem {
  id: string;
  type: "inquiry" | "feedback" | "audit";
  title: string;
  subtitle: string;
  time: string;
  href: string;
}

interface FeedResponse {
  items: FeedItem[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}

// ─── Recipients tab types ────────────────────────────────────────────────────
interface Recipient {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  types: string[];
  createdAt: string;
}

const VALID_TYPES = ["inquiry", "feedback"];
const FEED_TYPES = ["inquiry", "feedback", "audit"] as const;

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  inquiry: { bg: "#dbeafe", color: "#1e40af" },
  feedback: { bg: "#d1fae5", color: "#065f46" },
  audit: { bg: "#fef3c7", color: "#92400e" },
};

const TYPE_ICONS: Record<string, string> = {
  inquiry: "✉",
  feedback: "★",
  audit: "✎",
};

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationsSettingsPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "recipients">("feed");

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Settings</h1>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === "feed" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("feed")}
        >
          Notifications
        </button>
        <button
          className={`${styles.tab} ${activeTab === "recipients" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("recipients")}
        >
          Recipients
        </button>
      </div>

      {activeTab === "feed" ? <NotificationsFeed /> : <RecipientsManager />}
    </div>
  );
}

// ─── Notifications Feed Tab ──────────────────────────────────────────────────

function NotificationsFeed() {
  const [res, setRes] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchFeed = useCallback(
    async (p: number, search: string, type: string, from: string, to: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("full", "true");
        params.set("page", String(p));
        params.set("limit", "20");
        if (search) params.set("search", search);
        if (type) params.set("type", type);
        if (from) params.set("from", from);
        if (to) params.set("to", to);

        const r = await fetch(`/api/admin/notifications?${params.toString()}`);
        if (!r.ok) throw new Error("Failed");
        const json: FeedResponse = await r.json();
        setRes(json);
      } catch {
        setRes(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeed(page, debouncedSearch, filterType, filterFrom, filterTo);
  }, [page, debouncedSearch, filterType, filterFrom, filterTo, fetchFeed]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("");
    setFilterFrom("");
    setFilterTo("");
    setPage(1);
  };

  const hasActiveFilters = searchQuery || filterType || filterFrom || filterTo;
  const items = res?.items ?? [];

  return (
    <div className={styles.feedSection}>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, email, or entity…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
          className={styles.filterSelect}
        >
          <option value="">All Types</option>
          {FEED_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterFrom}
          onChange={(e) => {
            setFilterFrom(e.target.value);
            setPage(1);
          }}
          className={styles.dateInput}
          placeholder="From"
        />
        <input
          type="date"
          value={filterTo}
          onChange={(e) => {
            setFilterTo(e.target.value);
            setPage(1);
          }}
          className={styles.dateInput}
          placeholder="To"
        />
        {hasActiveFilters && (
          <button className={styles.clearFilters} onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          {hasActiveFilters ? "No notifications match your filters." : "No notifications yet."}
        </div>
      ) : (
        <>
          <div className={styles.feedList}>
            {items.map((item) => {
              const cfg = TYPE_COLORS[item.type] ?? { bg: "#f0f0f5", color: "#5a5a6e" };
              return (
                <a key={item.id} href={item.href} className={styles.feedItem}>
                  <div className={styles.feedIcon} style={{ background: cfg.bg, color: cfg.color }}>
                    {TYPE_ICONS[item.type] ?? "•"}
                  </div>
                  <div className={styles.feedContent}>
                    <div className={styles.feedTitle}>{item.title}</div>
                    <div className={styles.feedSubtitle}>{item.subtitle}</div>
                  </div>
                  <div className={styles.feedMeta}>
                    <span
                      className={styles.feedBadge}
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {item.type}
                    </span>
                    <span className={styles.feedTime}>{formatRelative(item.time)}</span>
                  </div>
                </a>
              );
            })}
          </div>

          <Pagination
            page={res!.page}
            totalPages={res!.totalPages}
            total={res!.total}
            pageSize={res!.pageSize}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

// ─── Recipients Tab ──────────────────────────────────────────────────────────

function RecipientsManager() {
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["inquiry", "feedback"]);
  const [adding, setAdding] = useState(false);

  const fetchRecipients = async () => {
    try {
      const res = await fetch("/api/admin/notification-recipients");
      const d = await res.json();
      setRecipients(d.data ?? []);
    } catch {
      toast("error", "Failed to load recipients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecipients();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast("error", "Email is required.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/notification-recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, types: selectedTypes }),
      });
      if (res.ok) {
        toast("success", "Recipient added.");
        setEmail("");
        setName("");
        setSelectedTypes(["inquiry", "feedback"]);
        fetchRecipients();
      } else {
        const d = await res.json();
        toast("error", d.error ?? "Failed to add recipient.");
      }
    } catch {
      toast("error", "Network error.");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/notification-recipients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      if (res.ok) {
        toast("success", currentActive ? "Recipient deactivated." : "Recipient activated.");
        fetchRecipients();
      } else {
        const d = await res.json();
        toast("error", d.error ?? "Failed to update.");
      }
    } catch {
      toast("error", "Network error.");
    }
  };

  const handleToggleType = async (id: string, currentTypes: string[], type: string) => {
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    if (newTypes.length === 0) {
      toast("error", "At least one notification type is required.");
      return;
    }
    try {
      const res = await fetch("/api/admin/notification-recipients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, types: newTypes }),
      });
      if (res.ok) {
        fetchRecipients();
      } else {
        const d = await res.json();
        toast("error", d.error ?? "Failed to update.");
      }
    } catch {
      toast("error", "Network error.");
    }
  };

  const handleDelete = async (id: string, emailAddr: string) => {
    if (!confirm(`Remove ${emailAddr} from notifications?`)) return;
    try {
      const res = await fetch(`/api/admin/notification-recipients?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast("success", "Recipient removed.");
        fetchRecipients();
      } else {
        const d = await res.json();
        toast("error", d.error ?? "Failed to delete.");
      }
    } catch {
      toast("error", "Network error.");
    }
  };

  return (
    <div className={styles.recipientsSection}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Add Recipient</h2>
        <form onSubmit={handleAdd} className={styles.addForm}>
          <div className={styles.addFields}>
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.typeCheckboxes}>
            {VALID_TYPES.map((t) => (
              <label key={t} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(t)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTypes([...selectedTypes, t]);
                    } else {
                      setSelectedTypes(selectedTypes.filter((x) => x !== t));
                    }
                  }}
                  className={styles.checkbox}
                />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>
          <button type="submit" className={styles.btn} disabled={adding}>
            {adding ? "Adding..." : "Add Recipient"}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Recipients</h2>
        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : recipients.length === 0 ? (
          <div className={styles.empty}>No recipients configured.</div>
        ) : (
          <div className={styles.list}>
            {recipients.map((r) => (
              <div key={r.id} className={styles.recipientRow}>
                <div className={styles.recipientInfo}>
                  <span className={styles.recipientName}>{r.name ?? r.email}</span>
                  {r.name && <span className={styles.recipientEmail}>{r.email}</span>}
                </div>
                <div className={styles.recipientTypes}>
                  {VALID_TYPES.map((t) => (
                    <button
                      key={t}
                      className={`${styles.typeBadge} ${r.types.includes(t) ? styles.typeBadgeActive : ""}`}
                      onClick={() => handleToggleType(r.id, r.types, t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
                <div className={styles.recipientActions}>
                  <button
                    className={`${styles.toggleBtn} ${r.active ? styles.toggleActive : ""}`}
                    onClick={() => handleToggle(r.id, r.active)}
                  >
                    {r.active ? "Active" : "Inactive"}
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(r.id, r.email)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
