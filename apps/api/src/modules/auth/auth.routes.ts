import { Router } from "express";
import { registerSchema, loginSchema } from "@civictrack/shared";
import { validateBody } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { login, register, revokeSession, rotateSession } from "./auth.service.js";
import { authenticate } from "../../middleware/auth.js";
import { User } from "../users/user.model.js";
import { AppError } from "../../utils/errors.js";

const router = Router();
const cookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/api/v1/auth" };
router.post("/register", validateBody(registerSchema), asyncHandler(async (req, res) => {
  const session = await register(req.body);
  res.cookie("refreshToken", session.refreshToken, { ...cookieOptions, maxAge: 30 * 86400000 });
  res.status(201).json({ success: true, data: { accessToken: session.accessToken, user: session.user } });
}));
router.post("/login", validateBody(loginSchema), asyncHandler(async (req, res) => {
  const session = await login(req.body.email, req.body.password);
  res.cookie("refreshToken", session.refreshToken, { ...cookieOptions, maxAge: 30 * 86400000 });
  res.json({ success: true, data: { accessToken: session.accessToken, user: session.user } });
}));
router.post("/refresh", asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken as string | undefined;
  if (!token) throw new AppError("Refresh session required", 401);
  const session = await rotateSession(token);
  res.cookie("refreshToken", session.refreshToken, { ...cookieOptions, maxAge: 30 * 86400000 });
  res.json({ success: true, data: { accessToken: session.accessToken, user: session.user } });
}));
router.post("/logout", asyncHandler(async (req, res) => {
  await revokeSession(req.cookies.refreshToken);
  res.clearCookie("refreshToken", cookieOptions);
  res.json({ success: true, data: { message: "Signed out" } });
}));
router.get("/me", authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user!.id).select("name email role department");
  if (!user) throw new AppError("Account not found", 404);
  res.json({ success: true, data: user });
}));
export default router;
