import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services } from "@/data/services";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mdmevents.org";

interface TechServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((svc) => ({ slug: svc.id }));
}

export async function generateMetadata({ params }: TechServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((svc) => svc.id === slug);

  if (!service) return {};

  return {
    title: service.title,
    description: service.description.slice(0, 160),
    alternates: {
      canonical: `/services/tech/${slug}`,
    },
    openGraph: {
      title: `${service.title} — MDM Digital, Media & Technology Services`,
      description: service.description.slice(0, 160),
      url: `/services/tech/${slug}`,
    },
  };
}

export default async function TechServicePage({ params }: TechServicePageProps) {
  const { slug } = await params;
  const service = services.find((svc) => svc.id === slug);

  if (!service) {
    notFound();
  }

  return (
    <ServicePageLayout
      label="Tech & Digital Solutions"
      title={service.title}
      tagline={service.tagline}
      description={service.description}
      offerings={service.offerings}
      process={service.process}
      backHref="/services/tech"
      backLabel="Back to Tech & Digital Solutions"
    />
  );
}
