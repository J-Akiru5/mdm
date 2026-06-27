import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mdmevents.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MDM Events Management — Events That Move People, Brands, and Communities",
    template: "%s — MDM Events Management",
  },
  description:
    "MDM Events Management is a full-service events and activation partner that turns ideas into well-executed experiences. We plan, produce, and manage events that leave a lasting impact.",
  keywords: [
    "events management Iloilo",
    "event planner Iloilo City",
    "corporate events Iloilo",
    "event management company Philippines",
    "event production services Iloilo",
    "event organizer Western Visayas",
    "MDM Events Management",
    "corporate event planner",
    "event management services",
    "Iloilo event coordinator",
  ],
  authors: [{ name: "MDM Events Management", url: siteUrl }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    siteName: "MDM Events Management",
    url: siteUrl,
    title: "MDM Events Management — Events That Move People, Brands, and Communities",
    description:
      "MDM Events Management is a full-service events and activation partner that turns ideas into well-executed experiences. We plan, produce, and manage events that leave a lasting impact.",
    images: [
      {
        url: "/images/OG/image.png",
        width: 1200,
        height: 630,
        alt: "MDM Events Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mdmevents",
    images: ["/images/OG/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfairDisplay.variable} ${inter.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
