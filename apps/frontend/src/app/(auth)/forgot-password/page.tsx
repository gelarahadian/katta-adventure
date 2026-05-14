import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Lupa password"
      description="Masukkan email akun kamu, lalu kami kirimkan instruksi reset password ke email tersebut."
      footerText="Ingat password kamu?"
      footerLinkLabel="Kembali login"
      footerLinkHref="/login"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
