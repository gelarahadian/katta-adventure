import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "../lib/app-error.js";

export function validateRequestError(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof ZodError) {
    response.status(422).json({
      message: "Validation failed",
      issues: error.flatten()
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return;
  }

  response.status(500).json({
    message: "Internal server error"
  });

  next();
}
