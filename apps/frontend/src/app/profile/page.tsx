import type { Metadata } from "next";

import { ProfileForm } from "@/components/profile/profile-form";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";

export const metadata: Metadata = {
  title: "Profile | Katta Adventure",
  description: "Edit profile dan data pengguna akun kamu."
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/profile" />

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="User Profile"
          title="Data akun"
          description="Perbarui nama, email, dan nomor telepon kamu."
        />

        <div className="mt-8">
          <ProfileForm />
        </div>
      </section>
    </main>
  );
}
