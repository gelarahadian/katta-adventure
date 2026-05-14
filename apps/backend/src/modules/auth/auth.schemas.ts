import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  phone: z.string().trim().min(8).max(20).optional()
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(72)
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email()
});

export const refreshSessionSchema = z.object({
  refreshToken: z.string().min(1)
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(72)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type RefreshSessionInput = z.infer<typeof refreshSessionSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
