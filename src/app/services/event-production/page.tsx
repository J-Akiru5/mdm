"use client";

import ServicePageLayout from "@/components/services/ServicePageLayout";
import { services } from "@/data/services";

export default function EventProductionPage() {
  const svc = services.find((s) => s.id === "event-production")!;
  return (
    <ServicePageLayout
      label="EVENT PRODUCTION"
      title={svc.title}
      tagline={svc.tagline}
      description={svc.description}
      offerings={svc.offerings}
      process={svc.process}
    />
  );
}
