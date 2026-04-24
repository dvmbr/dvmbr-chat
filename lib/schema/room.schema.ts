import { z } from "../openapi/zod";
import type { Room, User } from "@prisma/client";

export const RoomSchema = z
  .object({
    id: z.number(),
    name: z.string().trim().min(1),
    creatorId: z.number().int().positive(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Room");

export const RoomCreateBodySchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .openapi("RoomCreateBody");

export const RoomUpdateBodySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
  })
  .openapi("RoomUpdateBody");

export const RoomQuerySchema = z
  .object({
    name: z.string().trim().optional(),
    cursor: z.coerce.number().int().optional(),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .openapi("RoomQuery");

export const RoomParamSchema = z.object({
  roomId: z.coerce.number().int().positive(),
});

export const RoomWithCreatorSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    creatorId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    creator: z.object({
      id: z.number(),
      nickname: z.string(),
    }),
  })
  .openapi("RoomWithCreator");

export type RoomDTO = z.infer<typeof RoomSchema>;
export type RoomCreateBodyDTO = z.infer<typeof RoomCreateBodySchema>;
export type RoomUpdateBodyDTO = z.infer<typeof RoomUpdateBodySchema>;
export type RoomQueryDTO = z.infer<typeof RoomQuerySchema>;
export type RoomParamDTO = z.infer<typeof RoomParamSchema>;
export type RoomWithCreatorDTO = z.infer<typeof RoomWithCreatorSchema>;

export function toRoomDTO(room: Room): RoomDTO {
  return RoomSchema.parse({
    id: room.id,
    name: room.name,
    creatorId: room.creatorId,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  });
}

export function toRoomWithCreatorDTO(
  room: Room & { creator: User },
): RoomWithCreatorDTO {
  return RoomWithCreatorSchema.parse({
    id: room.id,
    name: room.name,
    creatorId: room.creatorId,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),

    creator: {
      id: room.creator.id,
      nickname: room.creator.nickname,
    },
  });
}
