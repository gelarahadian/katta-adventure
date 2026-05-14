import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Selamat datang kembali"
      description="Masuk untuk melanjutkan belanja, melihat pesanan, dan mengelola akun Katta Adventure kamu."
      footerText="Belum punya akun?"
      footerLinkLabel="Daftar di sini"
      footerLinkHref="/register"
    >
      <div className="space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Lupa password?{" "}
          <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
            Reset sekarang
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
