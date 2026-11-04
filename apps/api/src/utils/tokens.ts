import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import { env } from "../config/env.js";
export function createAccessToken(user: { id: string; role: string; email: string }) {
  return jwt.sign(user, env.accessSecret, { expiresIn: "15m" });
}
export function createRefreshToken() { return randomBytes(48).toString("hex"); }
export function hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.accessSecret) as { id: string; role: string; email: string };
}
