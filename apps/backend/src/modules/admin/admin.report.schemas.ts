import { z } from "zod";

export const salesReportQuerySchema = z.object({
  period: z.enum(["daily", "monthly"]).default("daily")
});

export type SalesReportQueryInput = z.infer<typeof salesReportQuerySchema>;
