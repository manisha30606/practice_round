import { Complaint } from "./complaint.model.js";
import { Department } from "../departments/department.model.js";
import { User } from "../users/user.model.js";
import { AppError } from "../../utils/errors.js";
import { recordActivity } from "../activity/activity.service.js";
import { io } from "../../sockets/io.js";

const transitions: Record<string, string[]> = {
  submitted: ["under_review", "rejected"], under_review: ["approved", "rejected"],
  approved: ["assigned", "rejected"], assigned: ["in_progress", "reopened"],
  in_progress: ["resolved", "reopened"], resolved: ["closed", "reopened"],
  reopened: ["under_review", "assigned"], rejected: [], closed: []
};

export async function createComplaint(input: any, reporterId: string, images: Express.Multer.File[]) {
  const reference = `CT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const complaint = await Complaint.create({
    ...input, reference, reporter: reporterId,
    location: { type: "Point", coordinates: [input.longitude, input.latitude] },
    images: images.map(file => ({ url: `/uploads/${file.filename}`, mimeType: file.mimetype, size: file.size }))
  });
  await recordActivity({ complaintId: complaint.id, actorId: reporterId, action: "complaint_submitted", toStatus: "submitted" });
  io?.to("role:admin").emit("complaint:created", { id: complaint.id, reference });
  return complaint;
}
export async function listComplaints(user: Express.Request["user"], query: Record<string, string>) {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));
  const filter: Record<string, unknown> = { archivedAt: null };
  if (user?.role === "citizen") filter.reporter = user.id;
  if (user?.role === "worker") filter.assignedWorker = user.id;
  for (const key of ["status", "category", "priority"]) if (query[key]) filter[key] = query[key];
  if (query.q) filter.$text = { $search: query.q };
  const [items, total] = await Promise.all([
    Complaint.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
      .populate("reporter", "name").populate("department", "name").populate("assignedWorker", "name"),
    Complaint.countDocuments(filter)
  ]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
export async function getComplaint(id: string, user: NonNullable<Express.Request["user"]>) {
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new AppError("Complaint not found", 404);
  if (user.role === "citizen" && complaint.reporter.toString() !== user.id) throw new AppError("Forbidden", 403);
  if (user.role === "worker" && complaint.assignedWorker?.toString() !== user.id) throw new AppError("Forbidden", 403);
  await complaint.populate([
    { path: "reporter", select: "name" },
    { path: "department", select: "name" },
    { path: "assignedWorker", select: "name" }
  ]);
  const { ActivityLog } = await import("../activity/activity-log.model.js");
  const timeline = await ActivityLog.find({ complaint: id }).sort({ createdAt: 1 }).populate("actor", "name role");
  return { complaint, timeline };
}
export async function updateStatus(id: string, status: string, actor: NonNullable<Express.Request["user"]>, note?: string) {
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new AppError("Complaint not found", 404);
  if (!transitions[complaint.status]?.includes(status)) throw new AppError(`Cannot move complaint from ${complaint.status} to ${status}`, 409, "INVALID_TRANSITION");
  if (actor.role === "worker" && (complaint.assignedWorker?.toString() !== actor.id || !["in_progress", "resolved"].includes(status))) {
    throw new AppError("You cannot update this complaint", 403);
  }
  if (actor.role === "citizen") throw new AppError("Citizens cannot directly change complaint status", 403);
  const previous = complaint.status;
  complaint.status = status as typeof complaint.status;
  if (status === "resolved") complaint.resolvedAt = new Date();
  await complaint.save();
  await recordActivity({ complaintId: id, actorId: actor.id, action: "status_changed", fromStatus: previous, toStatus: status, details: { note } });
  io?.to(`complaint:${id}`).emit("complaint:updated", { id, status });
  return complaint;
}
export async function toggleVote(id: string, userId: string) {
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new AppError("Complaint not found", 404);
  const index = complaint.votes.findIndex(v => v.toString() === userId);
  if (index >= 0) complaint.votes.splice(index, 1); else complaint.votes.push(userId as never);
  await complaint.save();
  return { votes: complaint.votes.length, voted: index < 0 };
}
export async function nearbyComplaints(lat: number, lng: number, radiusKm: number) {
  return Complaint.find({
    status: { $nin: ["rejected", "closed"] },
    location: { $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: radiusKm * 1000 } }
  }).limit(100).select("reference title category status priority address location createdAt");
}
export async function routeDepartment(category: string) {
  return Department.findOne({ categories: category, isActive: true });
}
export async function assertWorker(workerId: string, departmentId: string) {
  const worker = await User.findOne({ _id: workerId, role: "worker", isActive: true });
  if (!worker) throw new AppError("Active field worker not found", 404);
  if (worker.department && worker.department.toString() !== departmentId) throw new AppError("Worker does not belong to this department", 409);
  return worker;
}
