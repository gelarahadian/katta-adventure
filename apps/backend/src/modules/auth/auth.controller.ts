import type { Request, Response } from "express";

import { authService } from "./auth.service.js";
import { authCookieOptions, refreshCookieName } from "./auth.constants.js";
import {
  forgotPasswordSchema,
  loginSchema,
  profileParamsSchema,
  resetPasswordSchema,
  refreshSessionSchema,
  registerSchema,
  updateProfileSchema
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
    status: "implemented-foundation",
    endpoints: [
      "POST /api/v1/auth/register",
      "POST /api/v1/auth/login",
      "POST /api/v1/auth/forgot-password",
      "POST /api/v1/auth/reset-password",
      "POST /api/v1/auth/refresh",
      "POST /api/v1/auth/logout"
    ]
  });
}

function writeRefreshCookie(response: Response, refreshToken: string, expiresAt: Date) {
  response.cookie(refreshCookieName, refreshToken, {
    ...authCookieOptions,
    expires: expiresAt
  });
}

function clearRefreshCookie(response: Response) {
  response.clearCookie(refreshCookieName, authCookieOptions);
}

export async function register(request: Request, response: Response) {
  const input = registerSchema.parse(request.body);
  const result = await authService.register(input);

  writeRefreshCookie(response, result.tokens.refreshToken, result.tokens.refreshExpiresAt);

  response.status(201).json({
    message: "Registration successful",
    user: result.user,
    accessToken: result.tokens.accessToken
  });
}

export async function login(request: Request, response: Response) {
  const input = loginSchema.parse(request.body);
  const result = await authService.login(input);

  writeRefreshCookie(response, result.tokens.refreshToken, result.tokens.refreshExpiresAt);

  response.status(200).json({
    message: "Login successful",
    user: result.user,
    accessToken: result.tokens.accessToken
  });
}

export async function forgotPassword(request: Request, response: Response) {
  const input = forgotPasswordSchema.parse(request.body);
  const result = await authService.forgotPassword(input);

  response.status(202).json(result);
}

export async function resetPassword(request: Request, response: Response) {
  const input = resetPasswordSchema.parse(request.body);
  const result = await authService.resetPassword(input);

  clearRefreshCookie(response);
  response.status(200).json(result);
}

export async function refreshSession(request: Request, response: Response) {
  const input = refreshSessionSchema.parse({
    refreshToken: getRefreshToken(request)
  });
  const result = await authService.refreshSession(input);

  writeRefreshCookie(response, result.tokens.refreshToken, result.tokens.refreshExpiresAt);

  response.status(200).json({
    message: "Session refreshed",
    user: result.user,
    accessToken: result.tokens.accessToken
  });
}

export async function logout(request: Request, response: Response) {
  const result = await authService.logout(getRefreshToken(request));

  clearRefreshCookie(response);
  response.status(200).json(result);
}

export async function getProfile(request: Request, response: Response) {
  const params = profileParamsSchema.parse(request.params);
  const result = await authService.getProfile(params);

  response.status(200).json({
    user: result
  });
}

export async function updateProfile(request: Request, response: Response) {
  const params = profileParamsSchema.parse(request.params);
  const input = updateProfileSchema.parse(request.body);
  const result = await authService.updateProfile(params, input);

  response.status(200).json(result);
}
