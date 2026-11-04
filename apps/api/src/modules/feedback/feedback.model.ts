import { Schema, model } from "mongoose";
const schema = new Schema({ complaint: { type: Schema.Types.ObjectId, ref: "Complaint", required: true, unique: true }, citizen: { type: Schema.Types.ObjectId, ref: "User", required: true }, rating: { type: Number, min: 1, max: 5, required: true }, comment: { type: String, maxlength: 1000 } }, { timestamps: true });
export const Feedback = model("Feedback", schema);
