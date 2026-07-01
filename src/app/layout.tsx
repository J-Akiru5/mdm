import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

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
    default: "MDM Digital, Media & Technology Services — From Ideas to Digital Impact",
    template: "%s — MDM Digital, Media & Technology Services",
  },
  description:
    "MDM Digital, Media & Technology Services empowers organizations to innovate, connect, and grow through technology, creativity, and digital transformation. From AI and web development to media production and event technology.",
  keywords: [
    "digital transformation Philippines",
    "technology consulting Iloilo",
    "web development Philippines",
    "AI solutions Philippines",
    "digital services Iloilo City",
    "media production Philippines",
    "business automation Philippines",
    "MDM Digital",
    "digital innovation Philippines",
    "website development Iloilo",
    "social media marketing Philippines",
    "event technology solutions",
    "membership management systems",
    "data analytics Philippines",
    "managed digital services",
  ],
  authors: [{ name: "MDM Digital, Media & Technology Services", url: siteUrl }],
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
    siteName: "MDM Digital, Media & Technology Services",
    url: siteUrl,
    title: "MDM Digital, Media & Technology Services — From Ideas to Digital Impact",
    description:
      "MDM Digital, Media & Technology Services empowers organizations to innovate, connect, and grow through technology, creativity, and digital transformation.",
    images: [
      {
        url: "/images/OG/image.png",
        width: 1200,
        height: 630,
        alt: "MDM Digital, Media & Technology Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mdmdigital",
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
      <body>{children}</body>
    </html>
  );
}
