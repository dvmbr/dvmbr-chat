import { z } from "../openapi/zod";
import type { Room, User } from "@prisma/client";

const BaseRoomSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().trim().min(1),
  creatorId: z.coerce.number().int().positive(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RoomSchema = BaseRoomSchema.openapi("Room");

export const RoomWithCreatorSchema = BaseRoomSchema.extend({
  creator: z.object({
    id: z.coerce.number().int().positive(),
    nickname: z.string().trim().min(1),
  }),
}).openapi("RoomWithCreator");

export const CreateRoomSchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .openapi("CreateRoom");

export const UpdateRoomSchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .openapi("UpdateRoom");

export const RoomParamSchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("RoomParam");

export type RoomDto = z.infer<typeof RoomSchema>;
export type RoomWithCreatorDto = z.infer<typeof RoomWithCreatorSchema>;
export type CreateRoomDto = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomDto = z.infer<typeof UpdateRoomSchema>;
export type RoomParamDto = z.infer<typeof RoomParamSchema>;

export function toRoomDto(room: Room): RoomDto {
  return {
    id: room.id,
    name: room.name,
    creatorId: room.creatorId,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };
}

type RoomWithCreator = Room & {
  creator: Pick<User, "id" | "nickname">;
};

export function toRoomWithCreatorDto(
  room: RoomWithCreator,
): RoomWithCreatorDto {
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
