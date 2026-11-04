import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { User } from "./user.model.js";
const router = Router();
router.use(authenticate, authorize("admin"));
router.get("/", asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).select("name email role department").populate("department", "name").sort({ name: 1 });
  res.json({ success: true, data: users });
}));
export default router;
