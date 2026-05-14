import type { CookieOptions } from "express";

import { env } from "../../config/env.js";

const isProduction = env.NODE_ENV === "production";

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  path: "/"
};

export const refreshCookieName = "refreshToken";
