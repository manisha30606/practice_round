import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/errors.js";
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ success: false, error: { message: error.message, code: error.code } });
    return;
  }
  if (error?.name === "MulterError") {
    res.status(400).json({ success: false, error: { message: error.message, code: "UPLOAD_ERROR" } });
    return;
  }
  console.error(error);
  res.status(500).json({ success: false, error: { message: "An unexpected error occurred", code: "INTERNAL_ERROR" } });
};
