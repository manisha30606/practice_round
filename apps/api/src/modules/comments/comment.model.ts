import { Schema, model } from "mongoose";
const schema = new Schema({ complaint: { type: Schema.Types.ObjectId, ref: "Complaint", required: true, index: true }, author: { type: Schema.Types.ObjectId, ref: "User", required: true }, body: { type: String, required: true, maxlength: 1500 } }, { timestamps: true });
export const Comment = model("Comment", schema);
