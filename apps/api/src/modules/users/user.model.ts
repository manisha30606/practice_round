import { Schema, model, type InferSchemaType } from "mongoose";
export type Role = "citizen" | "admin" | "worker";
const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["citizen", "admin", "worker"], default: "citizen", required: true },
  phone: { type: String, trim: true },
  department: { type: Schema.Types.ObjectId, ref: "Department" },
  isActive: { type: Boolean, default: true },
  refreshTokenHash: { type: String, select: false }
}, { timestamps: true });
export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);
