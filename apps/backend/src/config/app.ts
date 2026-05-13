import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./env.js";
import { validateRequestError } from "../middlewares/validate-request.js";
import { apiRouter } from "../routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.APP_ORIGIN,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: "@katta/backend"
    });
  });

  app.use("/api", apiRouter);
  app.use(validateRequestError);

  return app;
}
