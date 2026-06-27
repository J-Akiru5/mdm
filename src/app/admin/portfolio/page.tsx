"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

interface PortfolioImage {
  id?: string;
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
  const [form, setForm] = useState({ title: "", category: "", image_url: "", client_logo: "" });
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragActiveIndex, setDragActiveIndex] = useState<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const fetchItems = useCallback(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
    const newImages: PortfolioImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) newImages.push({ url, sort_order: images.length + i });
    }
    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
    e.target.value = "";
  };

  // Drag-and-drop handlers for gallery images
  const handleDragStart = (index: number) => {
    setDragActiveIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragActiveIndex === null || dragOverItem.current === null) return;
    if (dragActiveIndex === dragOverItem.current) {
      setDragActiveIndex(null);
      dragOverItem.current = null;
      return;
    }
    setImages((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(dragActiveIndex, 1);
      updated.splice(dragOverItem.current!, 0, removed);
      return updated.map((img, i) => ({ ...img, sort_order: i }));
    });
    setDragActiveIndex(null);
    dragOverItem.current = null;
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag-and-drop for portfolio items (reorder)
  const handleItemDragStart = (index: number, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    setDragActiveIndex(index);
  };

  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleItemDrop = async (targetIndex: number) => {
    if (dragActiveIndex === null || dragActiveIndex === targetIndex) {
      setDragActiveIndex(null);
      return;
    }
    const sourceIndex = dragActiveIndex;
    setDragActiveIndex(null);

    const updatedItems = [...items];
    const [removed] = updatedItems.splice(sourceIndex, 1);
    updatedItems.splice(targetIndex, 0, removed);
    setItems(updatedItems);
  };

  const handleSave = async () => {
    if (!form.title || !form.category) return alert("Title and category are required");
    if (!form.image_url) return alert("Cover image is required");

    const payload = {
      title: form.title,
      category: form.category,
      image_url: form.image_url,
      client_logo: form.client_logo || null,
      images: images.map((img, i) => ({ url: img.url, sort_order: i })),
    };

    try {
      const res = await fetch("/api/portfolio", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...payload, id: editing.id } : payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.error || "Unknown error"));
        return;
      }

      resetForm();
      fetchItems();
    } catch (err) {
      alert("Network error: " + String(err));
    }
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;
    const res = await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchItems();
    } else {
      alert("Failed to delete item");
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: "", category: "", image_url: "", client_logo: "" });
    setImages([]);
  };

  // Handle drop zone for gallery images
  const handleDropZoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;
    setUploading(true);
    const newImages: PortfolioImage[] = [];
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) newImages.push({ url, sort_order: images.length + newImages.length });
    }
    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div>
      <h1 className={styles.heading}>Portfolio</h1>

      {/* CRUD Form */}
      <div className={styles.form}>
        <h2>{editing ? "Edit Item" : "Add New Item"}</h2>
        <div className={styles.formFields}>
          <input
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={styles.input}
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className={styles.input}
          >
            <option value="">Select category *</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          {/* Cover Image */}
          <label className={styles.fieldLabel}>Cover Image *</label>
          <div className={styles.uploadRow}>
            <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
            {uploading && <span className={styles.uploading}>Uploading...</span>}
            {form.image_url && (
              <img src={form.image_url} alt="cover preview" className={styles.preview} />
            )}
            {form.image_url && (
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                className={`${styles.btn} ${styles.btnSmall} ${styles.btnDanger}`}
              >
                Remove
              </button>
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
          <label className={styles.fieldLabel}>Gallery Images (drag to reorder)</label>
          <div
            className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              setDragOver(false);
            }}
            onDrop={handleDropZoneDrop}
          >
            {uploading ? (
              <span>Uploading...</span>
            ) : (
              <>
                <span>Drop images here</span>
                <label className={styles.browseBtn}>
                  or click to browse
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultiUpload}
                    className={styles.browseInput}
                  />
                </label>
              </>
            )}
          </div>

          {images.length > 0 && (
            <div className={styles.imageGrid}>
              {images.map((img, i) => (
                <div
                  key={`${img.url}-${i}`}
                  className={styles.imageItem}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  style={{ opacity: dragActiveIndex === i ? 0.5 : 1 }}
                >
                  <div className={styles.dragHandle}>&#9776;</div>
                  <img src={img.url} alt={`Gallery ${i + 1}`} className={styles.imageThumb} />
                  <div className={styles.imageMeta}>
                    <span className={styles.imageIndex}>#{i + 1}</span>
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
            <button
              onClick={handleSave}
              className={styles.btn}
              disabled={uploading || !form.title || !form.category}
            >
              {editing ? "Update" : "Add Item"}
            </button>
            {editing && (
              <button onClick={resetForm} className={`${styles.btn} ${styles.btnSecondary}`}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className={styles.listHeader}>
        <h2>Items ({items.length})</h2>
      </div>
      <div className={styles.list}>
        {items.length === 0 && <p className={styles.empty}>No portfolio items yet.</p>}
        {items.map((item, index) => (
          <div
            key={item.id}
            className={styles.item}
            draggable
            onDragStart={(e) => handleItemDragStart(index, e)}
            onDragOver={handleItemDragOver}
            onDrop={() => handleItemDrop(index)}
          >
            <div className={styles.dragHandle}>&#9776;</div>
            <img src={item.image_url} alt={item.title} className={styles.thumb} />
            <div className={styles.itemInfo}>
              <strong>{item.title}</strong>
              <span className={styles.category}>{item.category}</span>
              {item.client_logo && <span className={styles.badge}>Has logo</span>}
              {item.images && item.images.length > 0 && (
                <span className={styles.badge}>{item.images.length} photos</span>
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
