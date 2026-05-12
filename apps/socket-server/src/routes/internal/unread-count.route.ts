import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { SOCKET_INTERNAL_SECRET_HEADER } from "@dvmbr/shared/socket/internal";

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
    Headers: {
      [SOCKET_INTERNAL_SECRET_HEADER]?: string;
    };
    Body: UnreadCountBodyDTO;
    Reply: {
      200: OkResponseDTO;
      401: ErrorResponseDTO;
      500: ErrorResponseDTO;
    };
  }>(
    "/internal/unread-count",
    {
      schema: UnreadCountSchema,
    },
    async (req, reply) => {
      try {
        const internalSecret = process.env.SOCKET_INTERNAL_SECRET;

        if (
          !internalSecret ||
          req.headers[SOCKET_INTERNAL_SECRET_HEADER] !== internalSecret
        ) {
          return reply.code(401).send({ ok: false });
        }

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
