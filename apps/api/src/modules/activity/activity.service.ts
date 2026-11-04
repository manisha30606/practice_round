import { ActivityLog } from "./activity-log.model.js";
import { Notification } from "../notifications/notification.model.js";
import { io } from "../../sockets/io.js";
export async function recordActivity(input: {
  complaintId: string; actorId: string; action: string; fromStatus?: string; toStatus?: string;
  details?: Record<string, unknown>; notifyUserIds?: string[];
}) {
  const entry = await ActivityLog.create({
    complaint: input.complaintId, actor: input.actorId, action: input.action,
    fromStatus: input.fromStatus, toStatus: input.toStatus, details: input.details
  });
  if (input.notifyUserIds?.length) {
    const docs = input.notifyUserIds.map(recipient => ({
      recipient, type: input.action, title: "Complaint update",
      message: input.details?.message?.toString() ?? `Complaint activity: ${input.action}`,
      resourceId: input.complaintId
    }));
    const notifications = await Notification.insertMany(docs);
    for (const notification of notifications) io?.to(`user:${notification.recipient}`).emit("notification:new", notification);
  }
  return entry;
}
