import { PaymentProvider } from "@prisma/client";
import { z } from "zod";

export const createOrderSchema = z.object({
  recipientName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  province: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  district: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(4).max(10),
  line1: z.string().trim().min(5).max(200),
  line2: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(300).optional(),
  customerNote: z.string().trim().max(500).optional(),
  paymentProvider: z.nativeEnum(PaymentProvider).default(PaymentProvider.MANUAL)
});

export const midtransWebhookSchema = z.object({
  order_id: z.string().min(1),
  status_code: z.string().min(1),
  gross_amount: z.string().min(1),
  signature_key: z.string().min(1),
  transaction_status: z.string().min(1),
  fraud_status: z.string().optional(),
  transaction_id: z.string().optional(),
  payment_type: z.string().optional()
});

export const orderStatusParamsSchema = z.object({
  orderNumber: z.string().trim().min(1)
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type MidtransWebhookInput = z.infer<typeof midtransWebhookSchema>;
export type OrderStatusParamsInput = z.infer<typeof orderStatusParamsSchema>;
