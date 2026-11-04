import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDatabase } from "./connect.js";
import { User } from "../modules/users/user.model.js";
import { Department } from "../modules/departments/department.model.js";
import { Complaint } from "../modules/complaints/complaint.model.js";

async function seed() {
  await connectDatabase();
  const passwordHash = await bcrypt.hash("CivicTrack!2026", 12);
  const departments = [
    { name: "Public Works", code: "PWD", categories: ["road_damage", "public_infrastructure"] },
    { name: "Sanitation", code: "SAN", categories: ["garbage_sanitation", "drainage"] },
    { name: "Utilities", code: "UTL", categories: ["streetlight", "water_leakage"] }
  ];
  for (const item of departments) await Department.updateOne({ code: item.code }, { $set: item }, { upsert: true });
  const sanitation = await Department.findOne({ code: "SAN" });
  const accounts = [
    { name: "Aarav Citizen", email: "citizen@civictrack.local", role: "citizen" },
    { name: "Mira Administrator", email: "admin@civictrack.local", role: "admin" },
    { name: "Rohan Field Worker", email: "worker@civictrack.local", role: "worker", department: sanitation?._id }
  ];
  for (const account of accounts) await User.updateOne({ email: account.email }, { $set: { ...account, passwordHash, isActive: true } }, { upsert: true });
  const citizen = await User.findOne({ email: "citizen@civictrack.local" });
  if (citizen && await Complaint.countDocuments() === 0) {
    await Complaint.create([
      { reference: "CT-2026-DEMO01", title: "Overflowing public waste bin", description: "Waste has accumulated around the community bin for several days and needs collection.", category: "garbage_sanitation", address: "Park Street, Kolkata", location: { type: "Point", coordinates: [88.352, 22.553] }, reporter: citizen._id, priority: "high", status: "submitted" },
      { reference: "CT-2026-DEMO02", title: "Blocked roadside drain", description: "Water is not draining after rain and is spilling onto the footpath.", category: "drainage", address: "Ballygunge, Kolkata", location: { type: "Point", coordinates: [88.366, 22.527] }, reporter: citizen._id, priority: "medium", status: "under_review" }
    ]);
  }
  console.info("Seed complete. Demo password: CivicTrack!2026");
  await mongoose.disconnect();
}
seed().catch(async error => { console.error(error); await mongoose.disconnect(); process.exit(1); });
