import type { Metadata } from "next";
import { Toaster } from "sonner";

import { SiteFooter } from "@/components/storefront/site-footer";

import "./globals.css";

export const metadata: Metadata = {
  title: "Katta Adventure",
  description: "Modern adventure gear store for durable outdoor essentials."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-background text-foreground">
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(186,209,192,0.55),transparent_38%),linear-gradient(180deg,#fbfcf9_0%,#f4f6ef_48%,#eef1e6_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[linear-gradient(180deg,rgba(245,248,240,0.2),transparent)]" />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <Toaster richColors position="top-right" />
        </div>
      </body>
    </html>
  );
}
