import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  dark = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`${styles.heading} ${styles[align]} ${dark ? styles.dark : ""}`}
    >
      {subtitle && (
        <span className={styles.subtitle}>{subtitle}</span>
      )}
      <h2 className={styles.title}>{title}</h2>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  );
}
