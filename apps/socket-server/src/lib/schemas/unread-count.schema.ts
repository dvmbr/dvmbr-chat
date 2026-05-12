import type { FastifySchema } from "fastify";
import type { UserRoomUnreadCountPayload } from "@dvmbr/shared/socket";

import { ErrorResponseSchema, OkResponseSchema } from "./response.schema.js";

export type UnreadCountBodyDTO = {
  payloads: UserRoomUnreadCountPayload[];
};

export const UnreadCountBodySchema = {
  type: "object",
  required: ["payloads"],
  properties: {
    payloads: {
      type: "array",
      items: {
        type: "object",
        required: ["roomId", "userId", "unreadCount"],
        properties: {
          roomId: { type: "integer", minimum: 1 },
          userId: { type: "integer", minimum: 1 },
          unreadCount: { type: "integer", minimum: 0 },
        },
      },
    },
  },
} as const;

export const UnreadCountSchema = {
  body: UnreadCountBodySchema,
  response: {
    200: OkResponseSchema,
    500: ErrorResponseSchema,
  },
} satisfies FastifySchema;
