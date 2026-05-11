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

const RoomDeleteResultSchema = z
  .object({
    message: z.string(),
  })
  .openapi("RoomDeleteResult");

export function registerRoomOpenApi(registry: OpenAPIRegistry) {
  registry.register("Room", RoomSchema);
  registry.register("RoomCreateBody", RoomCreateBodySchema);
  registry.register("RoomUpdateBody", RoomUpdateBodySchema);
  registry.register("RoomParams", RoomParamsSchema);
  registry.register("RoomDeleteResult", RoomDeleteResultSchema);

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
      "Deletes a room and its participants. Only the room creator can delete the room",
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
}
