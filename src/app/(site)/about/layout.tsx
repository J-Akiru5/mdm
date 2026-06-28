import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MDM Events Management is a full-service events and activation partner based in Iloilo, Philippines. Learn about our team, mission, and the communities we serve.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us — MDM Events Management",
    description:
      "MDM Events Management is a full-service events and activation partner based in Iloilo, Philippines.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
