import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../utils/errors.js";
export const validateBody = (schema: ZodType): RequestHandler => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return next(new AppError(parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; "), 422, "VALIDATION_ERROR"));
  req.body = parsed.data;
  next();
};
