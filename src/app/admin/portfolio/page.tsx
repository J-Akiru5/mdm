"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  created_at: string;
}

const categories = ["corporate", "government", "launches", "festivals", "production", "exhibits"];

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState({ title: "", category: "", image_url: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data);
        setLoading(false);
      });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(fileName, file);
    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(fileName);
    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.category) return alert("Title and category required");
    const supabase = createClient();
    if (editing) {
      await supabase.from("portfolio").update(form).eq("id", editing.id);
    } else {
      await supabase.from("portfolio").insert({ ...form, id: crypto.randomUUID() });
    }
    setEditing(null);
    setForm({ title: "", category: "", image_url: "" });
    const { data } = await supabase
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditing(item);
    setForm({ title: item.title, category: item.category, image_url: item.image_url });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const supabase = createClient();
    await supabase.from("portfolio").delete().eq("id", id);
    const { data } = await supabase
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ title: "", category: "", image_url: "" });
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
          <div className={styles.uploadRow}>
            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
            {uploading && <span className={styles.uploading}>Uploading...</span>}
            {form.image_url && (
              <img src={form.image_url} alt="preview" className={styles.preview} />
            )}
          </div>
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
