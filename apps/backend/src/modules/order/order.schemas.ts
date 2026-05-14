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

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
