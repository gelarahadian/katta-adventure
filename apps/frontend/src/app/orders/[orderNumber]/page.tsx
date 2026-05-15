import type { Metadata } from "next";

import { OrderDetailView } from "@/components/orders/order-detail-view";
import { SectionHeading } from "@/components/storefront/section-heading";
import { SiteHeader } from "@/components/storefront/site-header";

interface OrderDetailPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber} | Katta Adventure`,
    description: "Detail pesanan dan tracking status pembayaran."
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;

  return (
    <main className="min-h-screen">
      <SiteHeader currentPath="/cart" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tracking"
          title={`Order ${orderNumber}`}
          description="Detail pesanan dan status pembayaran terbaru."
        />

        <OrderDetailView orderNumber={orderNumber} />
      </section>
    </main>
  );
}
