import { z } from "../openapi/zod";
import type { Room } from "@prisma/client";

export const RoomSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Room");

export const CreateRoomSchema = z
  .object({
    name: z.string(),
  })
  .openapi("CreateRoom");

export const UpdateRoomSchema = z
  .object({
    id: z.number(),
    name: z.string(),
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
    name: z.string().optional(),
  })
  .openapi("RoomQuery");

export type RoomDTO = z.infer<typeof RoomSchema>;
export type CreateRoomDTO = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomDTO = z.infer<typeof UpdateRoomSchema>;
export type DeleteRoomDTO = z.infer<typeof DeleteRoomSchema>;
export type RoomQueryDTO = z.infer<typeof RoomQuerySchema>;

export function toRoomDto(room: Room): RoomDTO {
  return {
    ...room,
    createdAt: new Date(room.createdAt).toISOString(),
    updatedAt: new Date(room.updatedAt).toISOString(),
  };
}
