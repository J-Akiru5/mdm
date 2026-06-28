import styles from "./BarChart.module.css";

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export default function BarChart({ data, color = "#9e1115", height = 180 }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={styles.container}>
      <div className={styles.chart} style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className={styles.barGroup}>
            <div className={styles.barWrapper}>
              <div
                className={styles.bar}
                style={{
                  height: `${(d.value / max) * 100}%`,
                  background: color,
                }}
                title={`${d.label}: ${d.value}`}
              />
            </div>
            <span className={styles.barValue}>{d.value}</span>
            <span className={styles.barLabel}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
