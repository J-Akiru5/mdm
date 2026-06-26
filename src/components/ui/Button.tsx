import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'outlineDark' | 'ghost';
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  as = "button",
  href,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const classNames = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  if (as === "a" && href) {
    return (
      <a href={href} className={classNames}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classNames} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
