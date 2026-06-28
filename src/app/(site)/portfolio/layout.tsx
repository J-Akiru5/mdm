import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Browse MDM Events Management's portfolio of successful corporate events, government functions, brand activations, festivals, and trade exhibits in Iloilo and across the Philippines.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Portfolio — MDM Events Management",
    description:
      "Browse MDM Events Management's portfolio of successful corporate events, government functions, brand activations, and festivals.",
    url: "/portfolio",
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
