import Link from "next/link";
import styles from "./RecentActivity.module.css";

interface Inquiry {
  id: string;
  fullName: string;
  eventType: string | null;
  createdAt: string;
}

interface FeedbackItem {
  id: string;
  name: string;
  rating: number;
  createdAt: string;
}

interface RecentActivityProps {
  inquiries: Inquiry[];
  feedback: FeedbackItem[];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return "Just now";
}

export default function RecentActivity({ inquiries, feedback }: RecentActivityProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Inquiries</h3>
          <Link href="/admin/inquiries" className={styles.viewAll}>
            View All →
          </Link>
        </div>
        {inquiries.length === 0 ? (
          <p className={styles.empty}>No inquiries yet.</p>
        ) : (
          <ul className={styles.list}>
            {inquiries.map((inq) => (
              <li key={inq.id} className={styles.item}>
                <div className={styles.itemMain}>
                  <span className={styles.itemName}>{inq.fullName}</span>
                  {inq.eventType && <span className={styles.badge}>{inq.eventType}</span>}
                </div>
                <span className={styles.itemTime}>{timeAgo(inq.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Feedback</h3>
          <Link href="/admin/feedback" className={styles.viewAll}>
            View All →
          </Link>
        </div>
        {feedback.length === 0 ? (
          <p className={styles.empty}>No feedback yet.</p>
        ) : (
          <ul className={styles.list}>
            {feedback.map((fb) => (
              <li key={fb.id} className={styles.item}>
                <div className={styles.itemMain}>
                  <span className={styles.itemName}>{fb.name}</span>
                  <span className={styles.stars}>
                    {"★".repeat(fb.rating)}
                    {"☆".repeat(5 - fb.rating)}
                  </span>
                </div>
                <span className={styles.itemTime}>{timeAgo(fb.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
