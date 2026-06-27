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

const categories = [
  { id: "all", label: "All" },
  { id: "corporate", label: "Corporate" },
  { id: "government", label: "Government" },
  { id: "launches", label: "Launches" },
  { id: "festivals", label: "Festivals" },
];

export default function PortfolioPreview() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data.slice(0, 6));
        setLoading(false);
      });
  }, []);

  const filtered =
    activeFilter === "all" ? items : items.filter((item) => item.category === activeFilter);

  return (
    <section id="portfolio" className="section">
      <div className="container-wide">
        <SectionHeading
          subtitle="Our Portfolio"
          title="Experiences We Have Brought to Life."
          align="center"
        />

        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.filterBtn} ${activeFilter === cat.id ? styles.active : ""}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.gallery}>
            {Array.from({ length: 6 }).map((_, i) => (
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
          <div className={styles.gallery}>
            {filtered.map((item) => (
              <Link key={item.id} href={`/portfolio/${item.id}`} className={styles.galleryItem}>
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
                {item.client_logo && (
                  <img src={item.client_logo} alt="Client logo" className={styles.clientLogo} />
                )}
                <div className={styles.label}>
                  <span>{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
