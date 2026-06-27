import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore MDM Events Management's full range of event services — from conceptualization, venue selection, and catering to entertainment, logistics, and digital solutions.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Our Services — MDM Events Management",
    description:
      "Explore MDM Events Management's full range of event services — from conceptualization, venue selection, and catering to entertainment, logistics, and digital solutions.",
    url: "/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
