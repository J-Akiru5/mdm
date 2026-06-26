import styles from "./HeroGlobe.module.css";

export default function HeroGlobe() {
  return (
    <div className={styles.globeOverlay} aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          stroke="rgba(213, 28, 36, 0.05)"
          strokeWidth="0.3"
          strokeDasharray="2 2"
        />
        <circle cx="50" cy="50" r="38" stroke="rgba(213, 28, 36, 0.05)" strokeWidth="0.3" />
        <circle
          cx="50"
          cy="50"
          r="28"
          stroke="rgba(213, 28, 36, 0.05)"
          strokeWidth="0.3"
          strokeDasharray="1 1"
        />
        <path d="M2 50H98" stroke="rgba(213, 28, 36, 0.07)" strokeWidth="0.3" />
        <path d="M50 2V98" stroke="rgba(213, 28, 36, 0.07)" strokeWidth="0.3" />
        <path
          d="M15 25C25 35 35 45 50 45C65 45 75 35 85 25"
          stroke="rgba(213, 28, 36, 0.04)"
          strokeWidth="0.3"
        />
        <path
          d="M15 75C25 65 35 55 50 55C65 55 75 65 85 75"
          stroke="rgba(213, 28, 36, 0.04)"
          strokeWidth="0.3"
        />
        <path
          d="M25 15C35 25 45 35 45 50C45 65 35 75 25 85"
          stroke="rgba(213, 28, 36, 0.04)"
          strokeWidth="0.3"
        />
        <path
          d="M75 15C65 25 55 35 55 50C55 65 65 75 75 85"
          stroke="rgba(213, 28, 36, 0.04)"
          strokeWidth="0.3"
        />
      </svg>
    </div>
  );
}
