import { Schema, model } from "mongoose";
const schema = new Schema({ complaint: { type: Schema.Types.ObjectId, ref: "Complaint", required: true, index: true }, actor: { type: Schema.Types.ObjectId, ref: "User", required: true }, action: { type: String, required: true }, fromStatus: String, toStatus: String, details: Schema.Types.Mixed }, { timestamps: true });
export const ActivityLog = model("ActivityLog", schema);
