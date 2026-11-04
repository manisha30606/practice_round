import { Schema, model } from "mongoose";
const schema = new Schema({ recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, type: { type: String, required: true }, title: { type: String, required: true }, message: { type: String, required: true }, resourceId: Schema.Types.ObjectId, readAt: Date }, { timestamps: true });
schema.index({ recipient: 1, readAt: 1, createdAt: -1 });
export const Notification = model("Notification", schema);
