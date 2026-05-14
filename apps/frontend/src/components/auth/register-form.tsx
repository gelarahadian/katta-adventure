"use client";

import { FormEvent, useState } from "react";

import { registerRequest } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await registerRequest({ name, email, password, phone: phone || undefined });
      setSuccess(response.message);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Registrasi gagal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nama
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none ring-primary/50 placeholder:text-muted-foreground focus:ring-2"
          placeholder="Nama lengkap"
          autoComplete="name"
          minLength={2}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="register-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none ring-primary/50 placeholder:text-muted-foreground focus:ring-2"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Nomor HP (opsional)
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none ring-primary/50 placeholder:text-muted-foreground focus:ring-2"
          placeholder="08xxxxxxxxxx"
          autoComplete="tel"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="register-password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none ring-primary/50 placeholder:text-muted-foreground focus:ring-2"
          placeholder="Minimal 8 karakter"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-primary">{success}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Buat akun"}
      </Button>
    </form>
  );
}
