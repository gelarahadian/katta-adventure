import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "../lib/app-error.js";

interface AccessPayload {
  sub: string;
  role: string;
  sessionId: string;
}

function getToken(request: Request) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length).trim();
}

export function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const token = getToken(request);
  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
    request.auth = {
      userId: payload.sub,
      role: payload.role,
      sessionId: payload.sessionId
    };
    next();
  } catch {
    throw new AppError("Unauthorized", 401);
  }
}
