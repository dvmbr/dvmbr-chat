import "dotenv/config";
import fastify from "fastify";
import { Server } from "socket.io";

import { registerRoutes } from "@/routes/register-routes.js";
import { registerSocketHandlers } from "@/socket/register-socket-handlers.js";

const PORT = parseInt(process.env.PORT || "4000", 10);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

const app = fastify();

const io = new Server(app.server, {
  cors: {
    origin: CLIENT_ORIGIN,
  },
});

await registerRoutes(app, io);
registerSocketHandlers(io);

app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Socket server is running on ${address}`);
});
