import { z } from "zod";
import { CATEGORIES, PRIORITIES, ROLES } from "./constants.js";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128)
});
export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});
export const complaintSchema = z.object({
  title: z.string().trim().min(8).max(120),
  description: z.string().trim().min(20).max(4000),
  category: z.enum(CATEGORIES),
  address: z.string().trim().min(5).max(300),
  landmark: z.string().trim().max(200).optional(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180)
});
export const assignmentSchema = z.object({
  complaintId: z.string().length(24),
  workerId: z.string().length(24),
  departmentId: z.string().length(24),
  priority: z.enum(PRIORITIES),
  slaHours: z.number().int().min(1).max(720).default(72)
});
export const roleSchema = z.enum(ROLES);
export type RegisterInput = z.infer<typeof registerSchema>;
export type ComplaintInput = z.infer<typeof complaintSchema>;
