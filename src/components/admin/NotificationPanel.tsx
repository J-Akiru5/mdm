"use client";

import { useEffect, useState } from "react";
import styles from "./NotificationPanel.module.css";

interface NotificationItem {
  id: string;
  type: "inquiry" | "feedback" | "audit";
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
}

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

const TYPE_ICONS: Record<string, { bg: string; color: string }> = {
  inquiry: { bg: "#dbeafe", color: "#1e40af" },
  feedback: { bg: "#d1fae5", color: "#065f46" },
  audit: { bg: "#fef3c7", color: "#92400e" },
};

export default function NotificationPanel({
  onClose,
  onRead,
}: {
  onClose: () => void;
  onRead?: () => void;
}) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items ?? []);
        setLoading(false);
        onRead?.();
      })
      .catch(() => setLoading(false));
  }, [onRead]);

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3 className={styles.title}>Notifications</h3>
          <span className={styles.count}>{items.length} new</span>
        </div>
        <div className={styles.list}>
          {loading ? (
            <div className={styles.empty}>Loading...</div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>No new notifications</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div
                  className={styles.icon}
                  style={{
                    background: TYPE_ICONS[item.type]?.bg ?? "#f0f0f5",
                    color: TYPE_ICONS[item.type]?.color ?? "#555",
                  }}
                >
                  {item.type === "inquiry" ? "✉" : item.type === "feedback" ? "★" : "✎"}
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{item.title}</div>
                  <div className={styles.itemSubtitle}>{item.subtitle}</div>
                </div>
                <span className={styles.time}>{formatRelative(item.time)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
