import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDatabase } from "./database/connect.js";
import { env } from "./config/env.js";
import { setSocketServer } from "./sockets/io.js";
import { verifyAccessToken } from "./utils/tokens.js";
import { Complaint } from "./modules/complaints/complaint.model.js";

async function main() {
  await connectDatabase();
  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: { origin: env.webOrigin, credentials: true } });
  setSocketServer(io);
  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) return next(new Error("Authentication required"));
    try { socket.data.user = verifyAccessToken(token); next(); }
    catch { next(new Error("Invalid access token")); }
  });
  io.on("connection", socket => {
    const user = socket.data.user as { id: string; role: string };
    socket.join(`user:${user.id}`);
    socket.join(`role:${user.role}`);
    socket.on("complaint:subscribe", (complaintId: string) => {
      if (typeof complaintId === "string" && /^[a-f\d]{24}$/i.test(complaintId)) socket.join(`complaint:${complaintId}`);
    });
  });
  httpServer.listen(env.port, () => console.info(`CivicTrack API listening on ${env.port}`));
}
main().catch(error => { console.error("API startup failed", error); process.exit(1); });
