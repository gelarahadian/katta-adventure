import { Router } from "express";

export const orderRouter = Router();

orderRouter.get("/status", (_request, response) => {
  response.status(200).json({
    module: "orders",
    status: "ready",
    next: ["cart", "checkout", "payment", "tracking"]
  });
});
