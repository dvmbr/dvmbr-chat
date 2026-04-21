import { z } from "../openapi/zod";
import type { Room } from "@prisma/client";

export const RoomSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    creatorId: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Room");

export const RoomWithCreatorSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    creatorId: z.number(),
    creator: z.object({
      id: z.number(),
      nickname: z.string(),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
  })

  .openapi("RoomWithCreator");

export const CreateRoomSchema = z
  .object({
    name: z.string().min(1),
    creatorId: z.number(),
  })
  .openapi("CreateRoom");

export const UpdateRoomSchema = z
  .object({
    id: z.number(),
    name: z.string().min(1),
  })
  .openapi("UpdateRoom");

export const DeleteRoomSchema = z
  .object({
    id: z.number(),
  })
  .openapi("DeleteRoom");

export const RoomQuerySchema = z
  .object({
    id: z.coerce.number().optional(),
    name: z.string().min(1).optional(),
  })
  .openapi("RoomQuery");

export type RoomDTO = z.infer<typeof RoomSchema>;
export type RoomWithCreatorDTO = z.infer<typeof RoomWithCreatorSchema>;

export type CreateRoomDTO = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomDTO = z.infer<typeof UpdateRoomSchema>;
export type DeleteRoomDTO = z.infer<typeof DeleteRoomSchema>;
export type RoomQueryDTO = z.infer<typeof RoomQuerySchema>;

export function toRoomDto(room: Room): RoomDTO {
  return {
    id: room.id,
    name: room.name,
    creatorId: room.creatorId,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };
}

type RoomWithCreator = Room & {
  creator: {
    id: number;
    nickname: string;
  };
};

export function toRoomWithCreatorDto(
  room: RoomWithCreator,
): RoomWithCreatorDTO {
  return {
    id: room.id,
    name: room.name,
    creatorId: room.creatorId,
    creator: {
      id: room.creator.id,
      nickname: room.creator.nickname,
    },

    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };
}
