import { redirect } from "next/navigation";

/**
 * Legacy /services/[slug] route — redirects to /services/tech/[slug].
 * All tech service detail pages now live under /services/tech/[slug].
 */
interface LegacyServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacyServiceRedirectPage({ params }: LegacyServicePageProps) {
  const { slug } = await params;
  redirect(`/services/tech/${slug}`);
}
