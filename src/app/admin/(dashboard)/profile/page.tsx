"use client";

import { useEffect, useState, useRef } from "react";
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

  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d))
      .catch(() => {});
  }, []);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMsg(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/profile/avatar", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const d = await res.json();
        setProfile((p) => ({ ...p, avatarUrl: d.avatarUrl }));
        setUploadMsg("Avatar updated.");
      } else {
        const d = await res.json();
        setUploadMsg(d.error ?? "Upload failed.");
      }
    } catch {
      setUploadMsg("Network error.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

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

        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarPlaceholder}>
                {profile.fullName?.charAt(0)?.toUpperCase() ?? "A"}
              </span>
            )}
          </div>
          <div className={styles.avatarActions}>
            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Choose Photo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarUpload}
              className={styles.fileInput}
            />
            <span className={styles.uploadHint}>JPEG, PNG, WebP, or GIF. Max 2MB.</span>
            {uploadMsg && <span className={styles.uploadMsg}>{uploadMsg}</span>}
          </div>
        </div>

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
