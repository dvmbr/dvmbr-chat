import { z } from "@/lib/openapi/zod";
import type { User } from "@prisma/client";

export const UserSchema = z
  .object({
    id: z.number(),
    nickname: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("User");

export const CreateUserSchema = z
  .object({
    nickname: z.string(),
  })
  .openapi("CreateUser");

export const UpdateUserSchema = z
  .object({
    id: z.number(),
    nickname: z.string().optional(),
  })
  .openapi("UpdateUser");

export const DeleteUserSchema = z
  .object({
    id: z.number(),
  })
  .openapi("DeleteUser");

export const UserQuerySchema = z
  .object({
    id: z.coerce.number().optional(),
    nickname: z.string().optional(),
  })
  .openapi("UserQuery");

export type UserDTO = z.infer<typeof UserSchema>;
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
export type DeleteUserDTO = z.infer<typeof DeleteUserSchema>;
export type UserQueryDTO = z.infer<typeof UserQuerySchema>;

export function toUserDto(user: User): UserDTO {
  return {
    ...user,
    createdAt: new Date(user.createdAt).toISOString(),
    updatedAt: new Date(user.updatedAt).toISOString(),
  };
}
