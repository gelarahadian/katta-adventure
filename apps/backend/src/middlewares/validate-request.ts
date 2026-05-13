import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

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

  next(error);
}
