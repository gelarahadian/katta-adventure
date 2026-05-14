import { Router } from "express";

import { authRouter } from "./auth.routes.js";
import { cartRouter } from "./cart.routes.js";
import { catalogRouter } from "./catalog.routes.js";
import { orderRouter } from "./order.routes.js";

export const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/catalog", catalogRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/orders", orderRouter);
