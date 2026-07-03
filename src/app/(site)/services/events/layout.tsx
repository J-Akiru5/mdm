import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Services",
  description:
    "MDM's full-service event management offerings — from conceptualization, venue selection, and catering to entertainment, talent management, logistics, and event marketing.",
  alternates: {
    canonical: "/services/events",
  },
  openGraph: {
    title: "Event Services — MDM Events Management",
    description:
      "MDM's full-service event management offerings — from conceptualization, venue selection, and catering to entertainment, talent management, logistics, and event marketing.",
    url: "/services/events",
  },
};

export default function EventServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
