import bcrypt from "bcryptjs";
import { User } from "../users/user.model.js";
import { AppError } from "../../utils/errors.js";
import { createAccessToken, createRefreshToken, hashToken } from "../../utils/tokens.js";

export async function register(input: { name: string; email: string; password: string }) {
  const exists = await User.exists({ email: input.email.toLowerCase() });
  if (exists) throw new AppError("An account with this email already exists", 409, "EMAIL_EXISTS");
  const user = await User.create({ name: input.name, email: input.email, passwordHash: await bcrypt.hash(input.password, 12), role: "citizen" });
  return issueSession(user);
}
export async function login(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError("Email or password is incorrect", 401, "INVALID_CREDENTIALS");
  return issueSession(user);
}
async function issueSession(user: InstanceType<typeof User>) {
  const refreshToken = createRefreshToken();
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();
  return { accessToken: createAccessToken({ id: user.id, role: user.role, email: user.email }), refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}
export async function rotateSession(refreshToken: string) {
  const user = await User.findOne({ refreshTokenHash: hashToken(refreshToken) }).select("+refreshTokenHash");
  if (!user || !user.isActive) throw new AppError("Refresh session is invalid", 401, "INVALID_SESSION");
  return issueSession(user);
}
export async function revokeSession(refreshToken?: string) {
  if (!refreshToken) return;
  await User.updateOne({ refreshTokenHash: hashToken(refreshToken) }, { $unset: { refreshTokenHash: 1 } });
}
