import { Room, User } from "@prisma/client";
import { z } from "../zod";

export const RoomCreatorSchema = z.object({
  id: z.number(),
  nickname: z.string(),
});

export const RoomSchema = z
  .object({
    id: z.number(),
    name: z.string().trim().min(1),
    creator: RoomCreatorSchema,
    unreadCount: z.number().int().nonnegative(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Room");

export const RoomParamsSchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("RoomParams");

export const RoomCreateBodySchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .openapi("RoomCreateBody");

export const RoomUpdateBodySchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .openapi("RoomUpdateBody");

export const RoomReadSchema = z
  .object({ updated: z.boolean() })
  .openapi("RoomRead");

export type RoomDTO = z.infer<typeof RoomSchema>;
export type RoomCreateBody = z.infer<typeof RoomCreateBodySchema>;
export type RoomUpdateBody = z.infer<typeof RoomUpdateBodySchema>;

export type RoomReadDTO = z.infer<typeof RoomReadSchema>;

export type RoomItem = Room & {
  creator: Pick<User, "id" | "nickname">;
  unreadCount?: number;
};

export function toRoomDTO(data: RoomItem): RoomDTO {
  return RoomSchema.parse({
    id: data.id,
    name: data.name,
    creator: {
      id: data.creator.id,
      nickname: data.creator.nickname,
    },
    unreadCount: data.unreadCount ?? 0,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  });
}

export function toRoomListDTO(data: RoomItem[]): RoomDTO[] {
  return data.map(toRoomDTO);
}

export function toRoomReadDTO(updated: boolean): RoomReadDTO {
  return RoomReadSchema.parse({ updated });
}
