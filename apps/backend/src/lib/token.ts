import { createHash, randomBytes } from "node:crypto";

import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

interface JwtPayloadShape {
  sub: string;
  role: string;
  sessionId: string;
}

export function signAccessToken(payload: JwtPayloadShape) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: `${env.JWT_ACCESS_EXPIRES_IN_MINUTES}m`
  });
}

export function signRefreshToken(payload: JwtPayloadShape) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.JWT_REFRESH_EXPIRES_IN_DAYS}d`
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayloadShape & jwt.JwtPayload;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateOpaqueToken(size = 32) {
  return randomBytes(size).toString("hex");
}
