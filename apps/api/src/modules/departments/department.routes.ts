import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { Department } from "./department.model.js";
import { AppError } from "../../utils/errors.js";
const router = Router();
router.use(authenticate);
router.get("/", asyncHandler(async (_req, res) => res.json({ success: true, data: await Department.find({ isActive: true }).sort({ name: 1 }) })));
router.post("/", authorize("admin"), asyncHandler(async (req, res) => {
  const name = String(req.body.name ?? "").trim();
  const code = String(req.body.code ?? "").trim().toUpperCase();
  if (name.length < 3 || code.length < 2) throw new AppError("Department name and code are required", 422);
  const department = await Department.create({ name, code, categories: req.body.categories ?? [] });
  res.status(201).json({ success: true, data: department });
}));
export default router;
