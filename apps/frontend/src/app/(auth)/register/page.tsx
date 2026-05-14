import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Buat akun baru"
      description="Daftar untuk mulai checkout lebih cepat, simpan riwayat pesanan, dan dapatkan update promo terbaru."
      footerText="Sudah punya akun?"
      footerLinkLabel="Masuk"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  );
}
