"use client";

import ServicePageLayout from "@/components/services/ServicePageLayout";
import { services } from "@/data/services";

export default function BrandingDesignPage() {
  const svc = services.find((s) => s.id === "branding-design")!;
  return (
    <ServicePageLayout
      label="BRANDING & DESIGN"
      title={svc.title}
      tagline={svc.tagline}
      description={svc.description}
      offerings={svc.offerings}
      process={svc.process}
    />
  );
}
