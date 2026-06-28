"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { ToastProvider } from "@/components/ui/Toast";
import styles from "./layout.module.css";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/audit-log", label: "Audit Log" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <Link href="/admin" className={styles.logo}>
            MDM Admin
          </Link>
          <nav className={styles.nav}>
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <form action={logout} className={styles.logoutForm}>
            <button type="submit" className={styles.logoutBtn}>
              Sign Out
            </button>
          </form>
          <Link href="/" className={styles.siteLink}>
            ← View Site
          </Link>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </ToastProvider>
  );
}
