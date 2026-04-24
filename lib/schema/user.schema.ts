import { z } from "../openapi/zod";
import type { User } from "@prisma/client";

export const UserSchema = z
  .object({
    id: z.number(),
    nickname: z.string().trim().min(1),
    lastRoomId: z.number().int().positive().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("User");

export const UserCreateBodySchema = z
  .object({
    nickname: z.string().trim().min(1),
  })
  .openapi("UserCreateBody");

export type UserDTO = z.infer<typeof UserSchema>;
export type UserCreateBodyDTO = z.infer<typeof UserCreateBodySchema>;

export function toUserDTO(user: User): UserDTO {
  return UserSchema.parse({
    id: user.id,
    nickname: user.nickname,
    lastRoomId: user.lastRoomId,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  });
}
