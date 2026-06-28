"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import DonutChart from "@/components/admin/DonutChart";
import BarChart from "@/components/admin/BarChart";
import RecentActivity from "@/components/admin/RecentActivity";
import CategoryBreakdown from "@/components/admin/CategoryBreakdown";
import Skeleton from "@/components/ui/Skeleton";
import styles from "./page.module.css";

interface AuditEvent {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  actorEmail: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface DashboardData {
  portfolioCount: number;
  inquiryCount: number;
  feedbackCount: number;
  avgRating: number;
  inquiriesThisWeek: number;
  feedbackThisWeek: number;
  inquiriesByEventType: { eventType: string; count: number }[];
  recentInquiries: { id: string; fullName: string; eventType: string | null; createdAt: string }[];
  recentFeedback: { id: string; name: string; rating: number; createdAt: string }[];
  portfolioByCategory: { category: string; count: number }[];
  monthlyInquiries: { month: string; count: number }[];
  recentAuditEvents: AuditEvent[];
}

const EVENT_COLORS: Record<string, string> = {
  corporate: "#9e1115",
  government: "#1a1a2e",
  launch: "#d51c24",
  festival: "#f59e0b",
  exhibit: "#3b82f6",
  other: "#555",
};

const AUDIT_ACTION_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  LOGIN: { bg: "#dbeafe", color: "#1e40af", label: "Login" },
  LOGIN_FAILED: { bg: "#fee2e2", color: "#991b1b", label: "Login Failed" },
  LOGOUT: { bg: "#f0f0f5", color: "#5a5a6e", label: "Logout" },
  CREATE: { bg: "#d1fae5", color: "#065f46", label: "Created" },
  UPDATE: { bg: "#fef3c7", color: "#92400e", label: "Updated" },
  DELETE: { bg: "#fee2e2", color: "#991b1b", label: "Deleted" },
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

function StarsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function InquiryIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function FeedbackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <Skeleton width={160} height={32} style={{ marginBottom: 24 }} />
      <div className={styles.statGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.skeletonCard}>
            <Skeleton width={40} height={40} />
            <Skeleton width={80} height={36} style={{ marginTop: 12 }} />
            <Skeleton width={100} height={16} style={{ marginTop: 4 }} />
          </div>
        ))}
      </div>
      <div className={styles.chartsGrid}>
        <div className={styles.skeletonChart}>
          <Skeleton width={160} height={160} borderRadius="50%" />
        </div>
        <div className={styles.skeletonChart}>
          <Skeleton width="100%" height={180} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (r) => {
        if (!r.ok) throw new Error("Stats API error");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!data) return <p className={styles.error}>Failed to load dashboard data.</p>;

  const donutData = (data.inquiriesByEventType ?? []).map((item) => ({
    label: item.eventType.charAt(0).toUpperCase() + item.eventType.slice(1),
    value: item.count,
    color: EVENT_COLORS[item.eventType] || "#555",
  }));

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Dashboard</h1>
        <span className={styles.lastUpdated}>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>

      <div className={styles.statGrid}>
        <StatCard
          icon={<PortfolioIcon />}
          value={data.portfolioCount}
          label="Portfolio Items"
          trend={data.inquiriesThisWeek > 0 ? undefined : undefined}
          href="/admin/portfolio"
        />
        <StatCard
          icon={<InquiryIcon />}
          value={data.inquiryCount}
          label="Inquiries"
          trend={data.inquiriesThisWeek > 0 ? `+${data.inquiriesThisWeek} this week` : undefined}
          href="/admin/inquiries"
        />
        <StatCard
          icon={<FeedbackIcon />}
          value={data.feedbackCount}
          label="Feedback"
          trend={data.feedbackThisWeek > 0 ? `+${data.feedbackThisWeek} this week` : undefined}
          href="/admin/feedback"
        />
        <StatCard
          icon={<StarsIcon />}
          value={data.avgRating > 0 ? data.avgRating.toFixed(1) : "—"}
          label="Avg Rating"
          href="/admin/feedback"
        />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Inquiries by Event Type</h2>
          <DonutChart data={donutData} />
        </div>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Monthly Inquiries</h2>
          <BarChart data={data.monthlyInquiries.map((m) => ({ label: m.month, value: m.count }))} />
        </div>
      </div>

      <RecentActivity inquiries={data.recentInquiries} feedback={data.recentFeedback} />

      <div className={styles.breakdownCard}>
        <h2 className={styles.chartTitle}>Portfolio by Category</h2>
        <CategoryBreakdown data={data.portfolioByCategory} />
      </div>

      {/* Admin Activity Feed */}
      {data.recentAuditEvents && data.recentAuditEvents.length > 0 && (
        <div className={styles.breakdownCard}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 className={styles.chartTitle} style={{ margin: 0 }}>
              Recent Admin Activity
            </h2>
            <a
              href="/admin/audit-log"
              style={{
                fontSize: "0.8rem",
                color: "#9b1b30",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              View all →
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {data.recentAuditEvents.map((ev) => {
              const actionCfg = AUDIT_ACTION_COLORS[ev.action] ?? {
                bg: "#f0f0f5",
                color: "#5a5a6e",
                label: ev.action,
              };
              const title = (ev.metadata as Record<string, unknown> | null)?.title as
                | string
                | undefined;
              return (
                <div
                  key={ev.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: "1px solid #f0f0f5",
                  }}
                >
                  <span
                    style={{
                      background: actionCfg.bg,
                      color: actionCfg.color,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 20,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {actionCfg.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "#1c1c28",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ev.entity}
                    {title ? ` · "${title}"` : ""}
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#b0b0bc",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {ev.actorEmail?.split("@")[0] ?? "—"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#b0b0bc",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {formatRelative(ev.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
