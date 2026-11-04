import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { Notification } from "./notification.model.js";
const router = Router();
router.use(authenticate);
router.get("/", asyncHandler(async (req, res) => res.json({ success: true, data: await Notification.find({ recipient: req.user!.id }).sort({ createdAt: -1 }).limit(50) })));
router.patch("/:id/read", asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user!.id }, { readAt: new Date() }, { new: true });
  res.json({ success: true, data: notification });
}));
export default router;
