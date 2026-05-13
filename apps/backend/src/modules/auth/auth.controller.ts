import type { Request, Response } from "express";

import { authService } from "./auth.service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSessionSchema,
  registerSchema
} from "./auth.schemas.js";

function getRefreshToken(request: Request) {
  const cookieToken = request.cookies?.refreshToken;
  const bodyToken =
    typeof request.body === "object" && request.body !== null ? request.body.refreshToken : undefined;

  return cookieToken ?? bodyToken;
}

export async function getAuthStatus(_request: Request, response: Response) {
  response.status(200).json({
    module: "auth",
    status: "skeleton-ready",
    endpoints: [
      "POST /api/v1/auth/register",
      "POST /api/v1/auth/login",
      "POST /api/v1/auth/forgot-password",
      "POST /api/v1/auth/refresh",
      "POST /api/v1/auth/logout"
    ]
  });
}

export async function register(request: Request, response: Response) {
  const input = registerSchema.parse(request.body);
  const result = await authService.register(input);

  response.status(202).json(result);
}

export async function login(request: Request, response: Response) {
  const input = loginSchema.parse(request.body);
  const result = await authService.login(input);

  response.status(202).json(result);
}

export async function forgotPassword(request: Request, response: Response) {
  const input = forgotPasswordSchema.parse(request.body);
  const result = await authService.forgotPassword(input);

  response.status(202).json(result);
}

export async function refreshSession(request: Request, response: Response) {
  const input = refreshSessionSchema.parse({
    refreshToken: getRefreshToken(request)
  });
  const result = await authService.refreshSession(input);

  response.status(202).json(result);
}

export async function logout(_request: Request, response: Response) {
  const result = await authService.logout();

  response.status(202).json(result);
}
