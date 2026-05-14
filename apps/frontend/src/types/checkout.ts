export interface CreateOrderPayload {
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  line1: string;
  line2?: string;
  notes?: string;
  customerNote?: string;
  paymentProvider: "MIDTRANS" | "XENDIT" | "MANUAL";
}

export interface CreateOrderResponse {
  message: string;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    subtotalAmount: string;
    shippingAmount: string;
    totalAmount: string;
    itemCount: number;
  };
  payment: {
    provider: "MIDTRANS";
    token: string;
    redirectUrl: string;
  } | null;
}
