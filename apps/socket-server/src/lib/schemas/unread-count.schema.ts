import { FastifySchema } from "fastify";

import { ErrorResponseSchema, OkResponseSchema } from "./response.schema.js";

export type UnreadCountBodyDTO = {
  payloads: {
    roomId: number;
    userId: number;
    unreadCount: number;
  }[];
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
          roomId: { type: "number" },
          userId: { type: "number" },
          unreadCount: { type: "number" },
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
