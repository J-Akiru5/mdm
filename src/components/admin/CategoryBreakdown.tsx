import styles from "./CategoryBreakdown.module.css";

interface CategoryBreakdownProps {
  data: { category: string; count: number }[];
}

const COLORS = [
  "#9e1115",
  "#1a1a2e",
  "#d51c24",
  "#555",
  "#b0b0bc",
  "#16a34a",
  "#f59e0b",
  "#3b82f6",
];

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) {
    return <p className={styles.empty}>No portfolio items yet.</p>;
  }

  return (
    <div className={styles.container}>
      {data.map((d, i) => {
        const percent = (d.count / total) * 100;
        return (
          <div key={d.category} className={styles.row}>
            <span className={styles.label}>{d.category}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${percent}%`,
                  background: COLORS[i % COLORS.length],
                }}
              />
            </div>
            <span className={styles.count}>{d.count}</span>
          </div>
        );
      })}
    </div>
  );
}
