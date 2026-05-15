"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProfileRequest, updateProfileRequest } from "@/lib/auth-client";
import { getAuthUser, updateStoredAuthUser } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";

export function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    async function loadProfile() {
      const authUser = getAuthUser();
      if (!authUser?.id) {
        setError("Sesi login tidak ditemukan.");
        setLoading(false);
        return;
      }

      setUserId(authUser.id);
      try {
        const response = await getProfileRequest(authUser.id);
        setForm({
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone ?? ""
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat profile");
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await updateProfileRequest(userId, {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined
      });

      updateStoredAuthUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role === "ADMIN" ? "admin" : "customer",
        status: response.user.status
      });

      toast.success("Profile berhasil diperbarui");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat profile...</p>;
  }

  if (error && !userId) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <form className="space-y-4 rounded-lg border border-border/70 bg-white/75 p-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="profile-name">
          Nama
        </label>
        <input
          id="profile-name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="profile-email">
          Email
        </label>
        <input
          id="profile-email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="profile-phone">
          Nomor HP
        </label>
        <input
          id="profile-phone"
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Menyimpan..." : "Simpan perubahan"}
      </Button>
    </form>
  );
}
