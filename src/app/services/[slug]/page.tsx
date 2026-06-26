import { notFound } from "next/navigation";
import { services } from "@/data/services";
import ServicePageLayout from "@/components/services/ServicePageLayout";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((svc) => ({ slug: svc.id }));
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
