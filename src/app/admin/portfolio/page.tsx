"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
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
  highlight: boolean;
  images: PortfolioImage[];
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  sort_order: number;
}

export default function AdminPortfolio() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"items" | "form" | "categories">("items");
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    image_url: "",
    client_logo: "",
    highlight: false,
  });
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragActiveIndex, setDragActiveIndex] = useState<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterHighlight, setFilterHighlight] = useState("all");

  // Category CRUD
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const categoryNames = categories.map((c) => c.name);

  const fetchItems = useCallback(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      });
  }, []);

  const fetchCategories = useCallback(() => {
    fetch("/api/portfolio/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      });
  }, []);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems, fetchCategories]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesHighlight =
      filterHighlight === "all" ||
      (filterHighlight === "highlighted" && item.highlight) ||
      (filterHighlight === "not-highlighted" && !item.highlight);
    return matchesSearch && matchesCategory && matchesHighlight;
  });

  const uploadFile = async (file: File): Promise<string | null> => {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(fileName, file);
    if (error) {
      toast("error", "Upload failed: " + error.message);
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
    if (!form.title || !form.category) return toast("error", "Title and category are required");
    if (!form.image_url) return toast("error", "Cover image is required");

    const payload = {
      title: form.title,
      category: form.category,
      image_url: form.image_url,
      client_logo: form.client_logo || null,
      highlight: form.highlight,
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
        toast("error", err.error || "Failed to save item");
        return;
      }

      toast("success", editing ? "Item updated successfully" : "Item created successfully");
      resetForm();
      setActiveTab("items");
      fetchItems();
    } catch {
      toast("error", "Network error. Please try again.");
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      category: item.category,
      image_url: item.image_url,
      client_logo: item.client_logo || "",
      highlight: item.highlight,
    });
    setImages(item.images ? [...item.images] : []);
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;
    const res = await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("success", "Item deleted successfully");
      fetchItems();
    } else {
      toast("error", "Failed to delete item");
    }
  };

  const handleToggleHighlight = async (id: string, current: boolean) => {
    const res = await fetch("/api/portfolio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, highlight: !current }),
    });
    if (res.ok) {
      toast("success", current ? "Removed from highlights" : "Added to highlights");
      fetchItems();
    } else {
      toast("error", "Failed to update highlight");
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ title: "", category: "", image_url: "", client_logo: "", highlight: false });
    setImages([]);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterHighlight("all");
  };

  const hasActiveFilters = searchQuery || filterCategory !== "all" || filterHighlight !== "all";

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

  // Category CRUD handlers
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return toast("error", "Category name is required");

    const res = await fetch("/api/portfolio/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    });

    if (res.ok) {
      toast("success", "Category added");
      setNewCategoryName("");
      fetchCategories();
    } else {
      const err = await res.json();
      toast("error", err.error || "Failed to add category");
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) return;

    const res = await fetch("/api/portfolio/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingCategory.id, name: editCategoryName }),
    });

    if (res.ok) {
      toast("success", "Category updated");
      setEditingCategory(null);
      setEditCategoryName("");
      fetchCategories();
    } else {
      const err = await res.json();
      toast("error", err.error || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Items using it will keep their value.")) return;

    const res = await fetch(`/api/portfolio/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast("success", "Category deleted");
      fetchCategories();
    } else {
      toast("error", "Failed to delete category");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div>
      <h1 className={styles.heading}>Portfolio</h1>

      {/* Tab Bar */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "items" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("items")}
        >
          Items ({items.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === "form" ? styles.tabActive : ""}`}
          onClick={() => {
            setActiveTab("form");
            if (!editing) resetForm();
          }}
        >
          {editing ? "Edit Item" : "Add New Item"}
        </button>
        <button
          className={`${styles.tab} ${activeTab === "categories" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories ({categories.length})
        </button>
      </div>

      {activeTab === "items" ? (
        <>
          {/* Filters */}
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Categories</option>
              {categoryNames.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filterHighlight}
              onChange={(e) => setFilterHighlight(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All</option>
              <option value="highlighted">Highlighted</option>
              <option value="not-highlighted">Not Highlighted</option>
            </select>
            {hasActiveFilters && (
              <button className={styles.clearFilters} onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>

          {/* Items List */}
          <div className={styles.list}>
            {filteredItems.length === 0 && (
              <p className={styles.empty}>
                {hasActiveFilters ? "No items match your filters." : "No portfolio items yet."}
              </p>
            )}
            {filteredItems.map((item, index) => (
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
                  {item.highlight && <span className={styles.highlightBadge}>★ Highlight</span>}
                  {item.client_logo && <span className={styles.badge}>Has logo</span>}
                  {item.images && item.images.length > 0 && (
                    <span className={styles.badge}>{item.images.length} photos</span>
                  )}
                </div>
                <div className={styles.itemActions}>
                  <button
                    onClick={() => handleToggleHighlight(item.id, item.highlight)}
                    className={`${styles.btn} ${styles.btnSmall} ${item.highlight ? styles.btnHighlightActive : styles.btnHighlight}`}
                    title={item.highlight ? "Remove from highlights" : "Add to highlights"}
                  >
                    {item.highlight ? "★" : "☆"}
                  </button>
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
        </>
      ) : activeTab === "form" ? (
        /* Form Tab */
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
              {categoryNames.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>

            <label className={styles.fieldLabel}>
              <input
                type="checkbox"
                checked={form.highlight}
                onChange={(e) => setForm((f) => ({ ...f, highlight: e.target.checked }))}
                className={styles.checkbox}
              />
              Show on homepage highlights
            </label>

            {/* Cover Image */}
            <label className={styles.fieldLabel}>Cover Image *</label>
            <div className={styles.uploadRow}>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                disabled={uploading}
              />
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
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
              />
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
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab("items");
                }}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Categories Tab */
        <div className={styles.form}>
          <h2>Manage Categories</h2>
          <p className={styles.categoryNote}>
            Categories appear as filters on the portfolio page and as options when creating items.
          </p>

          {/* Add Category */}
          <div className={styles.categoryAdd}>
            <input
              placeholder="New category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              className={styles.input}
            />
            <button
              onClick={handleAddCategory}
              className={styles.btn}
              disabled={!newCategoryName.trim()}
            >
              Add
            </button>
          </div>

          {/* Categories List */}
          <div className={styles.list}>
            {categories.length === 0 && (
              <p className={styles.empty}>No categories yet. Add one above.</p>
            )}
            {categories.map((cat) => (
              <div key={cat.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  {editingCategory?.id === cat.id ? (
                    <div className={styles.categoryEditRow}>
                      <input
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleUpdateCategory()}
                        className={styles.input}
                        autoFocus
                      />
                      <button
                        onClick={handleUpdateCategory}
                        className={`${styles.btn} ${styles.btnSmall}`}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setEditCategoryName("");
                        }}
                        className={`${styles.btn} ${styles.btnSmall} ${styles.btnSecondary}`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <strong>{cat.name}</strong>
                  )}
                </div>
                {editingCategory?.id !== cat.id && (
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setEditCategoryName(cat.name);
                      }}
                      className={`${styles.btn} ${styles.btnSmall}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className={`${styles.btn} ${styles.btnSmall} ${styles.btnDanger}`}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
