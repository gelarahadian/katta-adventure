"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { loginRequest } from "@/lib/auth-client";
import { setAuthSession } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await loginRequest({ email, password });
      setAuthSession(response.user, response.accessToken);
      setSuccess(response.message);
      router.push("/orders");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Login gagal.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
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
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-md border border-border bg-white px-3 text-sm outline-none ring-primary/50 placeholder:text-muted-foreground focus:ring-2"
          placeholder="Minimal 8 karakter"
          autoComplete="current-password"
          minLength={8}
          required
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-primary">{success}</p> : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : "Login"}
      </Button>
    </form>
  );
}
