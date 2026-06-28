"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import NotificationPanel from "@/components/admin/NotificationPanel";
import styles from "./TopBar.module.css";

interface Profile {
  email: string;
  fullName: string;
  avatarUrl: string;
}

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/portfolio": "Portfolio",
  "/admin/inquiries": "Inquiries",
  "/admin/feedback": "Feedback",
  "/admin/audit-log": "Audit Log",
  "/admin/settings": "Settings",
  "/admin/profile": "Profile",
};

export default function TopBar() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState<Profile>({ email: "", fullName: "", avatarUrl: "" });

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d))
      .catch(() => {});
  }, []);

  const fetchCount = useCallback(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => {
        const items = d.items ?? [];
        try {
          const raw = localStorage.getItem("mdm_notifications_read");
          const readIds: string[] = raw ? JSON.parse(raw) : [];
          const unread = items.filter((item: { id: string }) => !readIds.includes(item.id));
          setUnreadCount(unread.length);
        } catch {
          setUnreadCount(items.length);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCount();
    const id = setInterval(fetchCount, 60000);
    return () => clearInterval(id);
  }, [fetchCount]);

  const title =
    Object.entries(TITLES).find(([path]) =>
      path === "/admin" ? pathname === "/admin" : pathname.startsWith(path),
    )?.[1] ?? "Admin";

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.right}>
        <span className={styles.clock}>{time}</span>
        <div className={styles.notifWrapper}>
          <button
            className={styles.iconBtn}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="20"
              height="20"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount > 99 ? "99+" : unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} onRead={fetchCount} />
          )}
        </div>
        <Link href="/admin/profile" className={styles.profileLink}>
          <span className={styles.avatar}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className={styles.avatarImg} />
            ) : (
              (profile.fullName?.charAt(0)?.toUpperCase() ?? "A")
            )}
          </span>
          <span className={styles.profileName}>{profile.fullName || "Admin"}</span>
        </Link>
      </div>
    </header>
  );
}
