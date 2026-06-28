import { stats } from "@/data/stats";
import StatCounter from "../ui/StatCounter";
import styles from "./StatsBar.module.css";

export default function StatsBar() {
  return (
    <section className={styles.section}>
      <div className="container-wide">
        <div className={styles.inner}>
          {stats.map((stat) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
