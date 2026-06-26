"use client";

import ServicePageLayout from "@/components/services/ServicePageLayout";
import { services } from "@/data/services";

export default function EventPlanningPage() {
  const svc = services.find((s) => s.id === "event-planning")!;
  return (
    <ServicePageLayout
      label="EVENT PLANNING"
      title={svc.title}
      tagline={svc.tagline}
      description={svc.description}
      offerings={svc.offerings}
      process={svc.process}
    />
  );
}
