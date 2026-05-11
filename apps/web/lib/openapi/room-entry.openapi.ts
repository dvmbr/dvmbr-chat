import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  errorResponseSchema,
  okResponseSchema,
} from "@/lib/schemas/response/schema";
import { ChatRoomEntryParamsSchema } from "@/lib/schemas/chat-room-entry/request";
import { ChatRoomEntrySchema } from "@/lib/schemas/chat-room-entry/schema";

export function registerRoomEntryOpenApi(registry: OpenAPIRegistry) {
  registry.register("ChatRoomEntry", ChatRoomEntrySchema);
  registry.register("ChatRoomEntryParams", ChatRoomEntryParamsSchema);

  registry.registerPath({
    method: "post",
    path: "/api/rooms/entry",
    summary: "Enter last or personal room",
    description:
      "Returns the authenticated user's last room if available, otherwise creates or reuses a personal room and enters it",
    responses: {
      200: {
        description: "Room entry created successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(ChatRoomEntrySchema),
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
    path: "/api/rooms/{roomId}/entry",
    summary: "Enter specific room",
    description:
      "Creates or refreshes the authenticated user's participant entry for a specific room",
    request: {
      params: ChatRoomEntryParamsSchema,
    },
    responses: {
      200: {
        description: "Room entered successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(ChatRoomEntrySchema),
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
}
