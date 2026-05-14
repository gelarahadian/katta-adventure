import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import {
  forgotPassword,
  getAuthStatus,
  login,
  logout,
  refreshSession,
  resetPassword,
  register
} from "../../modules/auth/auth.controller.js";

export const authRouter = Router();

authRouter.get("/status", asyncHandler(getAuthStatus));
authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/forgot-password", asyncHandler(forgotPassword));
authRouter.post("/reset-password", asyncHandler(resetPassword));
authRouter.post("/refresh", asyncHandler(refreshSession));
authRouter.post("/logout", asyncHandler(logout));
