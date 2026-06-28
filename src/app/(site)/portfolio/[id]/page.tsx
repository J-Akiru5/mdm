"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

interface PortfolioImage {
  id: string;
  url: string;
  sort_order: number;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  client_logo: string | null;
  images: PortfolioImage[];
}

export default function PortfolioDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/portfolio/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <section className={styles.hero}>
        <div className="container heroContent" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>LOADING...</span>
        </div>
      </section>
    );
  }

  if (notFound || !item) {
    return (
      <>
        <section className={styles.hero}>
          <div className="container heroContent" style={{ textAlign: "center" }}>
            <span className={styles.heroLabel}>NOT FOUND</span>
            <h1 className={styles.heroTitle}>Event Not Found</h1>
          </div>
        </section>
        <section className="section" style={{ textAlign: "center" }}>
          <div className="container">
            <Link href="/portfolio" className={styles.backLink}>
              &larr; Back to Portfolio
            </Link>
          </div>
        </section>
      </>
    );
  }

  const displayImages =
    item.images.length > 0 ? item.images : [{ id: "cover", url: item.image_url, sort_order: 0 }];

  return (
    <>
      <section className={`${styles.hero} brandedHero`}>
        <div className="container heroContent" style={{ textAlign: "center" }}>
          <span className={styles.heroLabel}>{item.category.toUpperCase()}</span>
          <h1 className={styles.heroTitle}>{item.title}</h1>
          {item.client_logo && (
            <div className={styles.logoWrap}>
              <img src={item.client_logo} alt="Client logo" className={styles.clientLogo} />
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-wide">
          <div className={styles.backRow}>
            <Link href="/portfolio" className={styles.backLink}>
              &larr; Back to Portfolio
            </Link>
          </div>

          <div className={styles.gallery}>
            {displayImages.map((img, i) => (
              <div key={img.id} className={styles.galleryItem}>
                <Image
                  src={img.url}
                  alt={`${item.title} - Photo ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
