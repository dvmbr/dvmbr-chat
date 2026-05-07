import { FastifyInstance } from "fastify";
import { Server } from "socket.io";

import {
  UnreadCountBodyDTO,
  UnreadCountSchema,
} from "@/lib/schemas/unread-count.schema.js";
import { emitUnreadCount } from "@/socket/emit-unread-count.js";
import {
  ErrorResponseDTO,
  OkResponseDTO,
} from "@/lib/schemas/response.schema.js";

export async function unreadCountRoute(app: FastifyInstance, io: Server) {
  app.post<{
    Body: UnreadCountBodyDTO;
    Reply: {
      200: OkResponseDTO;
      500: ErrorResponseDTO;
    };
  }>(
    "/internal/unread-count",
    {
      schema: UnreadCountSchema,
    },
    async (req, reply) => {
      try {
        emitUnreadCount(io, req.body.payloads);

        return reply.code(200).send({ ok: true });
      } catch (error) {
        req.log.error(error);

        return reply.code(500).send({
          ok: false,
        });
      }
    },
  );
}
