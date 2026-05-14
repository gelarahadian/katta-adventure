"use client";

import { FormEvent, useState } from "react";

import { forgotPasswordRequest } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Email wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await forgotPasswordRequest({ email });
      setSuccess(response.message);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Permintaan reset gagal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label htmlFor="forgot-email" className="text-sm font-medium">
          Email akun
        </label>
        <input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none ring-primary/50 placeholder:text-muted-foreground focus:ring-2"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-primary">{success}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Kirim link reset"}
      </Button>
    </form>
  );
}
