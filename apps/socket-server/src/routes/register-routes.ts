import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { unreadCountRoute } from "./internal/unread-count.route.js";

export async function registerRoutes(app: FastifyInstance, io: Server) {
  await unreadCountRoute(app, io);
}
