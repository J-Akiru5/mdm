import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore MDM's two service pillars: Event Services for end-to-end event management, and Tech & Digital Solutions for websites, AI, media production, and digital transformation.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Our Services — MDM Digital, Media & Technology Services",
    description:
      "Explore MDM's two service pillars: Event Services for end-to-end event management, and Tech & Digital Solutions for websites, AI, media production, and digital transformation.",
    url: "/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
