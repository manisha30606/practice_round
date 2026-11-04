import type { RequestHandler } from "express";
import { verifyAccessToken } from "../utils/tokens.js";
import { AppError } from "../utils/errors.js";

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return next(new AppError("Authentication required", 401, "UNAUTHENTICATED"));
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    next(new AppError("Invalid or expired access token", 401, "INVALID_TOKEN"));
  }
};

export const authorize = (...roles: string[]): RequestHandler => (req, _res, next) => {
  if (!req.user) return next(new AppError("Authentication required", 401));
  if (!roles.includes(req.user.role)) return next(new AppError("You do not have permission to perform this action", 403, "FORBIDDEN"));
  next();
};
