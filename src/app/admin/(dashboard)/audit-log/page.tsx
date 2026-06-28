"use client";

import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/ui/Pagination";
import styles from "./page.module.css";

interface AuditLog {
  id: string;
  createdAt: string;
  action: string;
  entity: string;
  entityId: string | null;
  actorId: string | null;
  actorEmail: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
}

interface AuditResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  totalPages: number;
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  LOGIN: { label: "Login", color: "blue" },
  LOGIN_FAILED: { label: "Login Failed", color: "red" },
  LOGOUT: { label: "Logout", color: "gray" },
  CREATE: { label: "Create", color: "green" },
  UPDATE: { label: "Update", color: "amber" },
  DELETE: { label: "Delete", color: "red" },
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getEntityLabel(log: AuditLog): string {
  const metadata = log.metadata as Record<string, unknown> | null;
  const title = metadata?.title as string | undefined;
  if (title) return `${log.entity} · "${title}"`;
  if (log.entityId) return `${log.entity} · ${log.entityId.slice(0, 8)}…`;
  return log.entity;
}

function ActionBadge({ action }: { action: string }) {
  const config = ACTION_LABELS[action] ?? { label: action, color: "gray" };
  return (
    <span
      className={`${styles.badge} ${styles[`badge${config.color.charAt(0).toUpperCase() + config.color.slice(1)}`]}`}
    >
      {config.label}
    </span>
  );
}

function JsonDiff({ label, data }: { label: string; data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <div className={styles.jsonBlock}>
      <span className={styles.jsonLabel}>{label}</span>
      <pre className={styles.jsonPre}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

function AuditRow({ log }: { log: AuditLog }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = log.before || log.after;

  return (
    <>
      <tr
        className={`${styles.row} ${hasDetail ? styles.rowClickable : ""}`}
        onClick={() => hasDetail && setExpanded((p) => !p)}
        title={hasDetail ? "Click to view before/after" : undefined}
      >
        <td className={styles.tdTime}>
          <span className={styles.timeAgo} title={new Date(log.createdAt).toLocaleString()}>
            {formatRelativeTime(log.createdAt)}
          </span>
          <span className={styles.timeExact}>{new Date(log.createdAt).toLocaleString()}</span>
        </td>
        <td className={styles.tdAction}>
          <ActionBadge action={log.action} />
        </td>
        <td className={styles.tdEntity}>{getEntityLabel(log)}</td>
        <td className={styles.tdActor}>{log.actorEmail ?? <span className={styles.na}>—</span>}</td>
        <td className={styles.tdIp}>{log.ipAddress ?? <span className={styles.na}>—</span>}</td>
        <td className={styles.tdExpand}>
          {hasDetail && <span className={styles.expandIcon}>{expanded ? "▲" : "▼"}</span>}
        </td>
      </tr>
      {expanded && hasDetail && (
        <tr className={styles.rowDetail}>
          <td colSpan={6}>
            <div className={styles.diffRow}>
              <JsonDiff label="Before" data={log.before} />
              <JsonDiff label="After" data={log.after} />
            </div>
            {log.userAgent && (
              <div className={styles.uaRow}>
                <span className={styles.uaLabel}>User Agent:</span> {log.userAgent}
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default function AuditLogPage() {
  const [data, setData] = useState<AuditResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const fetchLogs = useCallback(
    async (p = page) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(p));
        if (search) params.set("search", search);
        if (action) params.set("action", action);
        if (entity) params.set("entity", entity);
        if (from) params.set("from", from);
        if (to) params.set("to", to);

        const res = await fetch(`/api/admin/audit-log?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } finally {
        setLoading(false);
      }
    },
    [page, search, action, entity, from, to],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs(1);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, action, entity, from, to]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const clearFilters = () => {
    setSearch("");
    setAction("");
    setEntity("");
    setFrom("");
    setTo("");
    setPage(1);
  };

  const hasActiveFilters = search || action || entity || from || to;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Audit Log</h1>
          <p className={styles.subheading}>
            Full trail of admin actions — logins, edits, and deletions.
          </p>
        </div>
        {data && <span className={styles.totalBadge}>{data.total.toLocaleString()} events</span>}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by actor email or record ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Actions</option>
          <option value="LOGIN">Login</option>
          <option value="LOGIN_FAILED">Login Failed</option>
          <option value="LOGOUT">Logout</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
        </select>

        <select
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Entities</option>
          <option value="Portfolio">Portfolio</option>
          <option value="Category">Category</option>
          <option value="Auth">Auth</option>
        </select>

        <div className={styles.dateGroup}>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={styles.dateInput}
            title="From date"
          />
          <span className={styles.dateSep}>→</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={styles.dateInput}
            title="To date"
          />
        </div>

        {hasActiveFilters && (
          <button onClick={clearFilters} className={styles.clearBtn}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <span>Loading audit events…</span>
          </div>
        ) : !data || data.logs.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📋</span>
            <p>{hasActiveFilters ? "No events match your filters." : "No audit events yet."}</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className={styles.clearBtn}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Timestamp</th>
                <th className={styles.th}>Action</th>
                <th className={styles.th}>Entity</th>
                <th className={styles.th}>Actor</th>
                <th className={styles.th}>IP Address</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {data.logs.map((log) => (
                <AuditRow key={log.id} log={log} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          total={data.total}
          pageSize={25}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
