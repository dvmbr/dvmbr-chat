import { Room } from "@prisma/client";
import { z } from "../zod";

export const RoomSchema = z
  .object({
    id: z.number(),
    name: z.string().trim().min(1),
    creatorId: z.number(),
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

export function toRoomDTO(data: Room): RoomDTO {
  return RoomSchema.parse({
    ...data,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  });
}
