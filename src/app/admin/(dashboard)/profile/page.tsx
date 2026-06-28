"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface ProfileData {
  email: string;
  fullName: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({ email: "", fullName: "", avatarUrl: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d))
      .catch(() => {});
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: profile.fullName, avatarUrl: profile.avatarUrl }),
      });
      if (res.ok) {
        setMessage("Profile updated.");
      } else {
        const d = await res.json();
        setMessage(d.error ?? "Failed to update.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwMessage("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPwMessage("Password must be at least 8 characters.");
      return;
    }
    setChangingPw(true);
    setPwMessage(null);
    try {
      const res = await fetch("/api/admin/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setPwMessage("Password changed.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const d = await res.json();
        setPwMessage(d.error ?? "Failed to change password.");
      }
    } catch {
      setPwMessage("Network error.");
    } finally {
      setChangingPw(false);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Profile</h1>

      <form onSubmit={handleSaveProfile} className={styles.card}>
        <h2 className={styles.cardTitle}>Account Information</h2>
        <div className={styles.field}>
          <label>Email</label>
          <input type="email" value={profile.email} disabled className={styles.disabledInput} />
        </div>
        <div className={styles.field}>
          <label>Display Name</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label>Avatar URL</label>
          <input
            type="url"
            value={profile.avatarUrl}
            onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
            placeholder="Paste an image URL (no file upload)"
          />
        </div>
        {message && <div className={styles.message}>{message}</div>}
        <button type="submit" className={styles.btn} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handleChangePassword} className={styles.card}>
        <h2 className={styles.cardTitle}>Change Password</h2>
        <div className={styles.field}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {pwMessage && <div className={styles.message}>{pwMessage}</div>}
        <button type="submit" className={styles.btn} disabled={changingPw}>
          {changingPw ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
