"use client";

import ServicePageLayout from "@/components/services/ServicePageLayout";
import { services } from "@/data/services";

export default function EventManagementPage() {
  const svc = services.find((s) => s.id === "event-management")!;
  return (
    <ServicePageLayout
      label="EVENT MANAGEMENT"
      title={svc.title}
      tagline={svc.tagline}
      description={svc.description}
      offerings={svc.offerings}
      process={svc.process}
    />
  );
}
