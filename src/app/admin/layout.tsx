import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { ToastProvider } from "@/components/ui/Toast";
import styles from "./layout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <Link href="/admin" className={styles.logo}>
            MDM Admin
          </Link>
          <nav className={styles.nav}>
            <Link href="/admin" className={styles.navLink}>
              Dashboard
            </Link>
            <Link href="/admin/portfolio" className={styles.navLink}>
              Portfolio
            </Link>
            <Link href="/admin/inquiries" className={styles.navLink}>
              Inquiries
            </Link>
            <Link href="/admin/feedback" className={styles.navLink}>
              Feedback
            </Link>
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
