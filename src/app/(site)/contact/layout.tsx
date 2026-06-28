import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MDM Events Management for your next event. Contact our Iloilo-based team for corporate events, government functions, brand activations, and more.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us — MDM Events Management",
    description:
      "Get in touch with MDM Events Management for your next event in Iloilo and across the Philippines.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
