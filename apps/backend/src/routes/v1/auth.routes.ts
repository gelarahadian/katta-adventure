import { Router } from "express";

export const authRouter = Router();

authRouter.get("/status", (_request, response) => {
  response.status(200).json({
    module: "auth",
    status: "ready",
    next: ["register", "login", "forgot-password", "refresh-token"]
  });
});
