"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "../ui/SectionHeading";
import Skeleton from "../ui/Skeleton";
import styles from "./PortfolioPreview.module.css";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  client_logo: string | null;
}

const categoryColors: Record<string, string> = {
  corporate: "#9B1B30",
  government: "#1A1A2E",
  launches: "#D4A853",
  festivals: "#2E7D32",
  production: "#1565C0",
  exhibits: "#6A1B9A",
};

export default function PortfolioPreview() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio?highlight=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="portfolio" className="section">
      <div className="container-wide">
        <SectionHeading
          subtitle="Our Portfolio"
          title="Experiences We Have Brought to Life."
          align="center"
        />

        {loading ? (
          <div className={styles.gallery}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.galleryItem}>
                <Skeleton height="100%" borderRadius="var(--border-radius-md)" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🚀</span>
            <h3 className={styles.emptyTitle}>Projects Coming Soon</h3>
            <p className={styles.emptyDesc}>
              We&apos;re crafting extraordinary experiences. Stay tuned for our latest work.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.gallery}>
              {items.slice(0, 6).map((item) => (
                <Link key={item.id} href={`/portfolio/${item.id}`} className={styles.galleryItem}>
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                  <span
                    className={styles.categoryBadge}
                    style={{ backgroundColor: categoryColors[item.category] || "#9B1B30" }}
                  >
                    {item.category}
                  </span>
                  <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                      <span className={styles.overlayTitle}>{item.title}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className={styles.seeMoreWrap}>
              <Link href="/portfolio" className={styles.seeMoreBtn}>
                View Full Portfolio &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
