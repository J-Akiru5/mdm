import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { eventServices } from "@/data/services/eventServices";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mdmevents.org";

interface EventServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return eventServices.map((svc) => ({ slug: svc.id }));
}

export async function generateMetadata({ params }: EventServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = eventServices.find((svc) => svc.id === slug);

  if (!service) return {};

  return {
    title: service.title,
    description: service.description.slice(0, 160),
    alternates: {
      canonical: `/services/events/${slug}`,
    },
    openGraph: {
      title: `${service.title} — MDM Events Management`,
      description: service.description.slice(0, 160),
      url: `/services/events/${slug}`,
    },
  };
}

export default async function EventServicePage({ params }: EventServicePageProps) {
  const { slug } = await params;
  const service = eventServices.find((svc) => svc.id === slug);

  if (!service) {
    notFound();
  }

  return (
    <ServicePageLayout
      label="Event Services"
      title={service.title}
      tagline={service.tagline}
      description={service.description}
      offerings={service.offerings}
      process={service.process}
      backHref="/services/events"
      backLabel="Back to Event Services"
    />
  );
}
