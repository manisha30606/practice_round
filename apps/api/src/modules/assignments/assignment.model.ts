import { Schema, model } from "mongoose";
const assignmentSchema = new Schema({
  complaint: { type: Schema.Types.ObjectId, ref: "Complaint", required: true, index: true },
  worker: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  state: { type: String, enum: ["pending", "accepted", "rejected", "completed"], default: "pending" },
  responseNote: String,
  progress: [{ note: String, images: [String], createdAt: { type: Date, default: Date.now } }],
  completedAt: Date
}, { timestamps: true });
assignmentSchema.index({ worker: 1, state: 1, updatedAt: -1 });
export const Assignment = model("Assignment", assignmentSchema);
