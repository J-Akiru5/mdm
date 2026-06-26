import { services } from "@/data/services";
import { techServices } from "@/data/services/techServices";
import styles from "./page.module.css";

export function getTechServiceData() {
  return services.find((s) => s.id === "technology-support")!;
}

export function getTechSubServices() {
  return techServices;
}

export { styles };
