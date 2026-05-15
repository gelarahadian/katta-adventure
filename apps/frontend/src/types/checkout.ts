export interface CreateOrderPayload {
  addressId?: string;
  address?: {
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    line1: string;
    line2?: string;
    notes?: string;
  };
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

export interface OrderStatusResponse {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: string;
  updatedAt: string;
  state: "success" | "pending" | "failed" | "refunded";
}
