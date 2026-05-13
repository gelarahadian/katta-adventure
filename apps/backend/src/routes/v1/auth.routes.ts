import { Router } from "express";

import {
  forgotPassword,
  getAuthStatus,
  login,
  logout,
  refreshSession,
  register
} from "../../modules/auth/auth.controller.js";

export const authRouter = Router();

authRouter.get("/status", getAuthStatus);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/refresh", refreshSession);
authRouter.post("/logout", logout);
