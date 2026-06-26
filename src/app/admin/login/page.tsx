import styles from "./page.module.css";
import { login } from "@/app/actions/auth";

export default function AdminLoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>MDM Admin</h1>
          <p className={styles.subtitle}>Sign in to manage your content</p>
        </div>
        <form className={styles.form} action={login}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className={styles.btn}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
