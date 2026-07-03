import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech & Digital Solutions",
  description:
    "MDM's technology and digital services — websites, AI & automation, social media, creative media studio, event technology, membership systems, analytics, and managed digital services.",
  alternates: {
    canonical: "/services/tech",
  },
  openGraph: {
    title: "Tech & Digital Solutions — MDM Digital, Media & Technology Services",
    description:
      "MDM's technology and digital services — websites, AI & automation, social media, creative media studio, event technology, membership systems, analytics, and managed digital services.",
    url: "/services/tech",
  },
};

export default function TechServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
