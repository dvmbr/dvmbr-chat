import { z } from "../openapi/zod";
import type { User } from "@prisma/client";

export const UserSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    nickname: z.string().trim().min(1),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("User");

export const CreateUserSchema = z
  .object({
    nickname: z.string().trim().min(1),
  })
  .openapi("CreateUser");

export const UpdateUserSchema = z
  .object({
    nickname: z.string().trim().min(1),
  })
  .openapi("UpdateUser");

export const UserParamSchema = z
  .object({
    userId: z.coerce.number().int().positive(),
  })
  .openapi("UserParam");

export type UserDto = z.infer<typeof UserSchema>;
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UserParamDto = z.infer<typeof UserParamSchema>;

export function toUserDto(user: User): UserDto {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
