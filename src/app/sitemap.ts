import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { eventServices } from "@/data/services/eventServices";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mdmevents.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services/tech`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const eventServicePages: MetadataRoute.Sitemap = eventServices.map((svc) => ({
    url: `${BASE_URL}/services/events/${svc.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const techServicePages: MetadataRoute.Sitemap = services.map((svc) => ({
    url: `${BASE_URL}/services/tech/${svc.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...eventServicePages, ...techServicePages];
}
