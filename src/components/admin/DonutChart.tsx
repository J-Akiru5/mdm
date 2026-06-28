import styles from "./DonutChart.module.css";

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export default function DonutChart({ data, size = 160 }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No data</div>
      </div>
    );
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const filtered = data.filter((d) => d.value > 0);
  const segments = filtered.reduce<
    { seg: (typeof filtered)[number]; strokeDasharray: string; rotation: number }[]
  >((acc, d) => {
    const percent = d.value / total;
    const prevPercent = acc.reduce((sum, a) => sum + a.seg.value / total, 0);
    const rotation = prevPercent * 360 - 90;
    acc.push({
      seg: d,
      strokeDasharray: `${percent * circumference} ${circumference}`,
      rotation,
    });
    return acc;
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <svg width={size} height={size} viewBox="0 0 160 160">
          {segments.map((s, i) => (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={s.seg.color}
              strokeWidth="24"
              strokeDasharray={s.strokeDasharray}
              transform={`rotate(${s.rotation} 80 80)`}
              className={styles.segment}
            />
          ))}
          <text x="80" y="76" textAnchor="middle" className={styles.totalValue}>
            {total}
          </text>
          <text x="80" y="94" textAnchor="middle" className={styles.totalLabel}>
            Total
          </text>
        </svg>
      </div>
      <div className={styles.legend}>
        {filtered.map((d, i) => (
          <div key={i} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: d.color }} />
            <span className={styles.legendLabel}>{d.label}</span>
            <span className={styles.legendValue}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
