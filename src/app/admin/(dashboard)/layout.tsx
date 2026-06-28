import { ToastProvider } from "@/components/ui/Toast";
import TopBar from "@/components/admin/TopBar";
import Sidebar from "@/components/admin/Sidebar";
import BottomTabBar from "@/components/admin/BottomTabBar";
import styles from "./layout.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.mainArea}>
          <TopBar />
          <main className={styles.content}>{children}</main>
        </div>
        <BottomTabBar />
      </div>
    </ToastProvider>
  );
}
