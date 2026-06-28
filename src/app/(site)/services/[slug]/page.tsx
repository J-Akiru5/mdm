import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services } from "@/data/services";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mdmevents.org";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((svc) => ({ slug: svc.id }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((svc) => svc.id === slug);

  if (!service) return {};

  return {
    title: service.title,
    description: service.description.slice(0, 160),
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} — MDM Events Management`,
      description: service.description.slice(0, 160),
      url: `/services/${slug}`,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((svc) => svc.id === slug);

  if (!service) {
    notFound();
  }

  return (
    <ServicePageLayout
      label="Our Services"
      title={service.title}
      tagline={service.tagline}
      description={service.description}
      offerings={service.offerings}
      process={service.process}
    />
  );
}
