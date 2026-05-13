import type { Metadata } from "next";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
