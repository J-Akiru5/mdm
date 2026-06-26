"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import SectionHeading from "../ui/SectionHeading";
import styles from "./PortfolioPreview.module.css";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
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
    async function fetchPortfolio() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("portfolio")
          .select("id, title, category, image_url")
          .order("created_at", { ascending: false })
          .limit(6);

        if (data) setItems(data);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  const filtered =
    activeFilter === "all" ? items : items.filter((item) => item.category === activeFilter);

  return (
    <section id="portfolio" className="section">
      <div className="container">
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
          <div className={styles.loading}>Loading portfolio...</div>
        ) : (
          <div className={styles.gallery}>
            {filtered.map((item) => (
              <div key={item.id} className={styles.galleryItem}>
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                />
                <div className={styles.label}>
                  <span>{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
