import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import {
  forgotPassword,
  getAuthStatus,
  getProfile,
  login,
  logout,
  refreshSession,
  resetPassword,
  register,
  updateProfile
} from "../../modules/auth/auth.controller.js";

export const authRouter = Router();

authRouter.get("/status", asyncHandler(getAuthStatus));
authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/forgot-password", asyncHandler(forgotPassword));
authRouter.post("/reset-password", asyncHandler(resetPassword));
authRouter.post("/refresh", asyncHandler(refreshSession));
authRouter.post("/logout", asyncHandler(logout));
authRouter.get("/profile/:userId", asyncHandler(getProfile));
authRouter.patch("/profile/:userId", asyncHandler(updateProfile));
