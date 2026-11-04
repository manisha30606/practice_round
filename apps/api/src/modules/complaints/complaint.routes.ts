import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { complaintSchema } from "@civictrack/shared";
import { authenticate, authorize } from "../../middleware/auth.js";
import { validateBody } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/errors.js";
import { Complaint } from "./complaint.model.js";
import { Comment } from "../comments/comment.model.js";
import { Feedback } from "../feedback/feedback.model.js";
import { createComplaint, getComplaint, listComplaints, nearbyComplaints, toggleVote, updateStatus } from "./complaint.service.js";
import { recordActivity } from "../activity/activity.service.js";

const router = Router();
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadDir),
  filename: (_req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage, limits: { fileSize: env.maxUploadBytes, files: 5 },
  fileFilter: (_req, file, cb) => ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype) ? cb(null, true) : cb(new AppError("Only JPG, PNG and WebP images are supported", 415))
});
router.use(authenticate);
router.get("/", asyncHandler(async (req, res) => res.json({ success: true, data: await listComplaints(req.user, req.query as Record<string, string>) })));
router.post("/", authorize("citizen"), upload.array("images", 5), asyncHandler(async (req, res) => {
  const parsed = complaintSchema.safeParse(req.body);
  if (!parsed.success) throw new AppError(parsed.error.issues.map(i => i.message).join("; "), 422);
  const complaint = await createComplaint(parsed.data, req.user!.id, (req.files as Express.Multer.File[]) ?? []);
  res.status(201).json({ success: true, data: complaint });
}));
router.get("/nearby", asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat), lng = Number(req.query.lng), radiusKm = Number(req.query.radiusKm ?? 5);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || radiusKm <= 0 || radiusKm > 50) throw new AppError("Valid lat, lng and radiusKm are required", 422);
  res.json({ success: true, data: await nearbyComplaints(lat, lng, radiusKm) });
}));
router.get("/:id", asyncHandler(async (req, res) => res.json({ success: true, data: await getComplaint(req.params.id, req.user!) })));
router.patch("/:id/status", authorize("admin"), asyncHandler(async (req, res) => {
  const complaint = await updateStatus(req.params.id, req.body.status, req.user!, req.body.note);
  res.json({ success: true, data: complaint });
}));
router.post("/:id/votes", authorize("citizen"), asyncHandler(async (req, res) => res.json({ success: true, data: await toggleVote(req.params.id, req.user!.id) })));
router.post("/:id/comments", asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new AppError("Complaint not found", 404);
  if (req.user!.role === "citizen" && complaint.reporter.toString() !== req.user!.id) throw new AppError("Forbidden", 403);
  const body = String(req.body.body ?? "").trim();
  if (body.length < 2 || body.length > 1500) throw new AppError("Comment must be 2–1500 characters", 422);
  const comment = await Comment.create({ complaint: complaint.id, author: req.user!.id, body });
  res.status(201).json({ success: true, data: comment });
}));
router.post("/:id/reopen", authorize("citizen"), asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({ _id: req.params.id, reporter: req.user!.id, status: "resolved" });
  if (!complaint) throw new AppError("Only your resolved complaints can be reopened", 409);
  const reason = String(req.body.reason ?? "").trim();
  if (reason.length < 10) throw new AppError("Please provide a reason of at least 10 characters", 422);
  const previous = complaint.status;
  complaint.status = "reopened";
  complaint.resolvedAt = undefined;
  await complaint.save();
  await recordActivity({
    complaintId: complaint.id,
    actorId: req.user!.id,
    action: "complaint_reopened",
    fromStatus: previous,
    toStatus: "reopened",
    details: { reason }
  });
  res.json({ success: true, data: complaint });
}));
router.post("/:id/feedback", authorize("citizen"), asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({ _id: req.params.id, reporter: req.user!.id, status: { $in: ["resolved", "closed"] } });
  if (!complaint) throw new AppError("Feedback is available after resolution", 409);
  const feedback = await Feedback.create({ complaint: complaint.id, citizen: req.user!.id, rating: Number(req.body.rating), comment: req.body.comment });
  res.status(201).json({ success: true, data: feedback });
}));
export default router;
