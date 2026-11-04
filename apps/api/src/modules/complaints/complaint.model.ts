import { Schema, model } from "mongoose";
const imageSchema = new Schema({ url: { type: String, required: true }, mimeType: String, size: Number, label: String }, { _id: false });
const complaintSchema = new Schema({
  reference: { type: String, unique: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 4000 },
  category: { type: String, required: true, index: true },
  images: [imageSchema],
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }
  },
  address: { type: String, required: true },
  landmark: String,
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium", index: true },
  status: { type: String, enum: ["submitted", "under_review", "approved", "assigned", "in_progress", "resolved", "reopened", "rejected", "closed"], default: "submitted", index: true },
  reporter: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  department: { type: Schema.Types.ObjectId, ref: "Department" },
  assignedWorker: { type: Schema.Types.ObjectId, ref: "User", index: true },
  deadline: { type: Date, index: true },
  resolvedAt: Date,
  votes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  archivedAt: Date
}, { timestamps: true });
complaintSchema.index({ location: "2dsphere" });
complaintSchema.index({ status: 1, priority: -1, createdAt: -1 });
complaintSchema.index({ title: "text", description: "text", address: "text" });
export const Complaint = model("Complaint", complaintSchema);
