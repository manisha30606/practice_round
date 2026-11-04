import type { Server } from "socket.io";
export let io: Server | undefined;
export function setSocketServer(server: Server) { io = server; }
