"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
  created_at: string;
}

const categories = ["corporate", "government", "launches", "festivals", "production", "exhibits"];

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    image_url: "",
    client_logo: "",
  });
  const [images, setImages] = useState<{ url: string; sort_order: number }[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchItems = () => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const uploadFile = async (file: File): Promise<string | null> => {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(fileName, file);
    if (error) {
      alert("Upload failed: " + error.message);
      return null;
    }
    const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) setForm((f) => ({ ...f, image_url: url }));
    setUploading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) setForm((f) => ({ ...f, client_logo: url }));
    setUploading(false);
  };

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newImages: { url: string; sort_order: number }[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) {
        newImages.push({ url, sort_order: images.length + i });
      }
    }
    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
    // Reset the file input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const newImages = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev;
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      return newImages.map((img, i) => ({ ...img, sort_order: i }));
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.category) return alert("Title and category required");
    const payload = {
      ...form,
      client_logo: form.client_logo || null,
      images: images.map((img, i) => ({ url: img.url, sort_order: i })),
    };
    await fetch("/api/portfolio", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { ...payload, id: editing.id } : payload),
    });
    setEditing(null);
    setForm({ title: "", category: "", image_url: "", client_logo: "" });
    setImages([]);
    fetchItems();
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      category: item.category,
      image_url: item.image_url,
      client_logo: item.client_logo || "",
    });
    setImages(item.images ? [...item.images] : []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ title: "", category: "", image_url: "", client_logo: "" });
    setImages([]);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div>
      <h1 className={styles.heading}>Portfolio</h1>

      <div className={styles.form}>
        <h2>{editing ? "Edit Item" : "Add Item"}</h2>
        <div className={styles.formFields}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={styles.input}
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className={styles.input}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Cover Image */}
          <label className={styles.fieldLabel}>Cover Image</label>
          <div className={styles.uploadRow}>
            <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
            {uploading && <span className={styles.uploading}>Uploading...</span>}
            {form.image_url && (
              <img src={form.image_url} alt="cover preview" className={styles.preview} />
            )}
          </div>

          {/* Client Logo */}
          <label className={styles.fieldLabel}>Client Logo (optional)</label>
          <div className={styles.uploadRow}>
            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
            {form.client_logo && (
              <img src={form.client_logo} alt="logo preview" className={styles.preview} />
            )}
            {form.client_logo && (
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, client_logo: "" }))}
                className={`${styles.btn} ${styles.btnSmall} ${styles.btnDanger}`}
              >
                Remove
              </button>
            )}
          </div>

          {/* Gallery Images */}
          <label className={styles.fieldLabel}>Gallery Images</label>
          <div className={styles.uploadRow}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultiUpload}
              disabled={uploading}
            />
          </div>
          {images.length > 0 && (
            <div className={styles.imageGrid}>
              {images.map((img, i) => (
                <div key={i} className={styles.imageItem}>
                  <img src={img.url} alt={`Gallery ${i + 1}`} className={styles.thumb} />
                  <div className={styles.imageActions}>
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      className={`${styles.btn} ${styles.btnSmall}`}
                    >
                      &uarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === images.length - 1}
                      className={`${styles.btn} ${styles.btnSmall}`}
                    >
                      &darr;
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className={`${styles.btn} ${styles.btnSmall} ${styles.btnDanger}`}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.formActions}>
            <button onClick={handleSave} className={styles.btn} disabled={uploading}>
              {editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button onClick={handleCancel} className={`${styles.btn} ${styles.btnSecondary}`}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {items.length === 0 && <p className={styles.empty}>No portfolio items yet.</p>}
        {items.map((item) => (
          <div key={item.id} className={styles.item}>
            <img src={item.image_url} alt={item.title} className={styles.thumb} />
            <div className={styles.itemInfo}>
              <strong>{item.title}</strong>
              <span className={styles.category}>{item.category}</span>
              {item.client_logo && <span className={styles.category}>Has client logo</span>}
              {item.images && item.images.length > 0 && (
                <span className={styles.category}>{item.images.length} gallery photos</span>
              )}
            </div>
            <div className={styles.itemActions}>
              <button
                onClick={() => handleEdit(item)}
                className={`${styles.btn} ${styles.btnSmall}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className={`${styles.btn} ${styles.btnSmall} ${styles.btnDanger}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
