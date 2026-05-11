import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  errorResponseSchema,
  listResponseSchema,
  okResponseSchema,
} from "@/lib/schemas/response/schema";
import {
  MessageCreateBodySchema,
  MessageParamsSchema,
} from "@/lib/schemas/message/request";
import { MessageSchema } from "@/lib/schemas/message/schema";

export function registerMessageOpenApi(registry: OpenAPIRegistry) {
  registry.register("Message", MessageSchema);
  registry.register("MessageParams", MessageParamsSchema);
  registry.register("MessageCreateBody", MessageCreateBodySchema);

  registry.registerPath({
    method: "get",
    path: "/api/rooms/{roomId}/messages",
    summary: "List room messages",
    description:
      "Returns messages for a room when the authenticated user is a participant",
    request: {
      params: MessageParamsSchema,
    },
    responses: {
      200: {
        description: "Message list returned successfully",
        content: {
          "application/json": {
            schema: listResponseSchema(MessageSchema),
          },
        },
      },
      400: {
        description: "Invalid roomId",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
      401: {
        description: "Authenticated user is not a participant in the room",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/rooms/{roomId}/messages",
    summary: "Create room message",
    description:
      "Creates a new message in the room when the authenticated user is a participant",
    request: {
      params: MessageParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: MessageCreateBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Message created successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(MessageSchema),
          },
        },
      },
      400: {
        description: "Invalid roomId or request body",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
      401: {
        description: "Authenticated user is not a participant in the room",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
    },
  });
}
