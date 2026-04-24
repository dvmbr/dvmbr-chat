import { User } from "@prisma/client";
import { z } from "../zod";

export const UserSchema = z
  .object({
    id: z.number(),
    nickname: z.string().trim().min(1),
    browserToken: z.string(),
    lastRoomId: z.number().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("User");

export const userCreateBodySchema = z
  .object({
    nickname: z.string().trim().min(1),
  })
  .openapi("UserCreateBody");

export type UserDTO = z.infer<typeof UserSchema>;
export type UserCreateBodyDTO = z.infer<typeof userCreateBodySchema>;

export function toUserDTO(data: User): UserDTO {
  return UserSchema.parse({
    ...data,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  });
}
