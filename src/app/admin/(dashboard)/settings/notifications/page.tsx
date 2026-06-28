"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import styles from "./page.module.css";

interface Recipient {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  types: string[];
  createdAt: string;
}

const VALID_TYPES = ["inquiry", "feedback"];

export default function NotificationRecipientsPage() {
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["inquiry", "feedback"]);
  const [adding, setAdding] = useState(false);

  const fetchRecipients = async () => {
    try {
      const res = await fetch("/api/admin/notification-recipients");
      const d = await res.json();
      setRecipients(d.data ?? []);
    } catch {
      toast("error", "Failed to load recipients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecipients();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast("error", "Email is required.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/notification-recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, types: selectedTypes }),
      });
      if (res.ok) {
        toast("success", "Recipient added.");
        setEmail("");
        setName("");
        setSelectedTypes(["inquiry", "feedback"]);
        fetchRecipients();
      } else {
        const d = await res.json();
        toast("error", d.error ?? "Failed to add recipient.");
      }
    } catch {
      toast("error", "Network error.");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/notification-recipients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      if (res.ok) {
        toast("success", currentActive ? "Recipient deactivated." : "Recipient activated.");
        fetchRecipients();
      } else {
        const d = await res.json();
        toast("error", d.error ?? "Failed to update.");
      }
    } catch {
      toast("error", "Network error.");
    }
  };

  const handleToggleType = async (id: string, currentTypes: string[], type: string) => {
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    if (newTypes.length === 0) {
      toast("error", "At least one notification type is required.");
      return;
    }
    try {
      const res = await fetch("/api/admin/notification-recipients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, types: newTypes }),
      });
      if (res.ok) {
        fetchRecipients();
      } else {
        const d = await res.json();
        toast("error", d.error ?? "Failed to update.");
      }
    } catch {
      toast("error", "Network error.");
    }
  };

  const handleDelete = async (id: string, emailAddr: string) => {
    if (!confirm(`Remove ${emailAddr} from notifications?`)) return;
    try {
      const res = await fetch(`/api/admin/notification-recipients?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast("success", "Recipient removed.");
        fetchRecipients();
      } else {
        const d = await res.json();
        toast("error", d.error ?? "Failed to delete.");
      }
    } catch {
      toast("error", "Network error.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Notification Recipients</h1>
        <span className={styles.totalBadge}>{recipients.length} total</span>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Add Recipient</h2>
        <form onSubmit={handleAdd} className={styles.addForm}>
          <div className={styles.addFields}>
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.typeCheckboxes}>
            {VALID_TYPES.map((t) => (
              <label key={t} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(t)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTypes([...selectedTypes, t]);
                    } else {
                      setSelectedTypes(selectedTypes.filter((x) => x !== t));
                    }
                  }}
                  className={styles.checkbox}
                />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>
          <button type="submit" className={styles.btn} disabled={adding}>
            {adding ? "Adding..." : "Add Recipient"}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Recipients</h2>
        {loading ? (
          <div className={styles.empty}>Loading...</div>
        ) : recipients.length === 0 ? (
          <div className={styles.empty}>No recipients configured.</div>
        ) : (
          <div className={styles.list}>
            {recipients.map((r) => (
              <div key={r.id} className={styles.recipientRow}>
                <div className={styles.recipientInfo}>
                  <span className={styles.recipientName}>{r.name ?? r.email}</span>
                  {r.name && <span className={styles.recipientEmail}>{r.email}</span>}
                </div>
                <div className={styles.recipientTypes}>
                  {VALID_TYPES.map((t) => (
                    <button
                      key={t}
                      className={`${styles.typeBadge} ${r.types.includes(t) ? styles.typeBadgeActive : ""}`}
                      onClick={() => handleToggleType(r.id, r.types, t)}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
                <div className={styles.recipientActions}>
                  <button
                    className={`${styles.toggleBtn} ${r.active ? styles.toggleActive : ""}`}
                    onClick={() => handleToggle(r.id, r.active)}
                  >
                    {r.active ? "Active" : "Inactive"}
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(r.id, r.email)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
