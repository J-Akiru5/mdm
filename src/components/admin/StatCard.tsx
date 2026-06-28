import Link from "next/link";
import styles from "./StatCard.module.css";

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  trend?: string;
  href?: string;
}

export default function StatCard({ icon, value, label, trend, href }: StatCardProps) {
  const content = (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        {trend && <span className={styles.trend}>{trend}</span>}
      </div>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={styles.link}>
        {content}
      </Link>
    );
  }
  return content;
}
