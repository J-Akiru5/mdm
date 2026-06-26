import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import styles from "./page.module.css";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: portfolioCount } = await supabase
    .from("portfolio")
    .select("*", { count: "exact", head: true });

  const { count: inquiryCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className={styles.heading}>Dashboard</h1>
      <div className={styles.grid}>
        <Link href="/admin/portfolio" className={styles.card}>
          <span className={styles.cardValue}>{portfolioCount ?? 0}</span>
          <span className={styles.cardLabel}>Portfolio Items</span>
        </Link>
        <Link href="/admin/inquiries" className={styles.card}>
          <span className={styles.cardValue}>{inquiryCount ?? 0}</span>
          <span className={styles.cardLabel}>Inquiries</span>
        </Link>
      </div>
    </div>
  );
}
