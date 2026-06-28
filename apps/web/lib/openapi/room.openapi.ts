import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "@/lib/zod";
import {
  errorResponseSchema,
  listResponseSchema,
  okResponseSchema,
} from "@/lib/schemas/response/schema";
import {
  RoomCreateBodySchema,
  RoomParamsSchema,
  RoomUpdateBodySchema,
} from "@/lib/schemas/room/request";
import { RoomSchema } from "@/lib/schemas/room/schema";
import { MessageSchema } from "@/lib/schemas/message/schema";

const RoomDeleteResultSchema = z
  .object({
    message: z.string(),
  })
  .openapi("RoomDeleteResult");

const AiModeBodySchema = z
  .object({ isAiMode: z.boolean() })
  .openapi("AiModeBody");

const AiModeResultSchema = z
  .object({ success: z.literal(true) })
  .openapi("AiModeResult");

const AiMessageBodySchema = z
  .object({
    message: z.string().optional(),
    greeting: z.boolean().optional(),
    farewell: z.boolean().optional(),
  })
  .openapi("AiMessageBody");

export function registerRoomOpenApi(registry: OpenAPIRegistry) {
  registry.register("Room", RoomSchema);
  registry.register("RoomCreateBody", RoomCreateBodySchema);
  registry.register("RoomUpdateBody", RoomUpdateBodySchema);
  registry.register("RoomParams", RoomParamsSchema);
  registry.register("RoomDeleteResult", RoomDeleteResultSchema);
  registry.register("AiModeBody", AiModeBodySchema);
  registry.register("AiModeResult", AiModeResultSchema);
  registry.register("AiMessageBody", AiMessageBodySchema);

  registry.registerPath({
    method: "get",
    path: "/api/rooms",
    summary: "List rooms",
    description:
      "Returns chat rooms that the authenticated user participates in",
    responses: {
      200: {
        description: "Room list returned successfully",
        content: {
          "application/json": {
            schema: listResponseSchema(RoomSchema),
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
    path: "/api/rooms",
    summary: "Create room",
    description: "Creates a new room owned by the authenticated user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: RoomCreateBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Room created successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(RoomSchema),
          },
        },
      },
      400: {
        description: "Invalid request body",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
      409: {
        description: "Room name already exists",
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
    method: "patch",
    path: "/api/rooms/{roomId}",
    summary: "Update room",
    description:
      "Updates a room name. Only the room creator can update the room",
    request: {
      params: RoomParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: RoomUpdateBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Room updated successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(RoomSchema),
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
      403: {
        description: "Only the room creator can update the room",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
      404: {
        description: "Room not found",
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
    method: "delete",
    path: "/api/rooms/{roomId}",
    summary: "Delete room",
    description:
      "Deletes a room and all its participants and messages via cascade. Only the room creator can delete the room",
    request: {
      params: RoomParamsSchema,
    },
    responses: {
      200: {
        description: "Room deleted successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(RoomDeleteResultSchema),
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
      403: {
        description: "Only the room creator can delete the room",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
      404: {
        description: "Room not found",
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
    path: "/api/rooms/{roomId}/read",
    summary: "Mark room as read",
    description:
      "Updates the authenticated participant's last read time for the room",
    request: {
      params: RoomParamsSchema,
    },
    responses: {
      200: {
        description: "Room marked as read successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(z.null()),
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
      403: {
        description: "Participant not found for this room",
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
    method: "patch",
    path: "/api/rooms/{roomId}/ai-mode",
    summary: "Toggle AI mode",
    description: "Enables or disables AI mode for a room. Only the room creator can change this.",
    request: {
      params: RoomParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: AiModeBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "AI mode updated successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(AiModeResultSchema),
          },
        },
      },
      400: {
        description: "Invalid roomId or isAiMode value",
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
    path: "/api/rooms/{roomId}/ai",
    summary: "Generate AI message",
    description:
      "Generates an AI response and persists it as an AI-type message. Accepts a regular message, a greeting trigger, or a farewell trigger.",
    request: {
      params: RoomParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: AiMessageBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "AI message generated successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(MessageSchema),
          },
        },
      },
      400: {
        description: "Invalid roomId or missing message content",
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
