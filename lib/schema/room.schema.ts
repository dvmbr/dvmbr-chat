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
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Room");

export const RoomCreateBodySchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .openapi("RoomCreateBody");

export type RoomDTO = z.infer<typeof RoomSchema>;
export type RoomCreateBodyDTO = z.infer<typeof RoomCreateBodySchema>;

type RoomWithCreator = Room & {
  creator: Pick<User, "id" | "nickname">;
};

export function toRoomDTO(data: RoomWithCreator): RoomDTO {
  return RoomSchema.parse({
    id: data.id,
    name: data.name,
    creator: {
      id: data.creator.id,
      nickname: data.creator.nickname,
    },
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  });
}

export function toRoomListDTO(data: RoomWithCreator[]): RoomDTO[] {
  return data.map(toRoomDTO);
}
