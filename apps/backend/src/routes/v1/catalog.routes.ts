import { Router } from "express";

export const catalogRouter = Router();

catalogRouter.get("/status", (_request, response) => {
  response.status(200).json({
    module: "catalog",
    status: "ready",
    next: ["products", "categories", "search", "filters"]
  });
});
