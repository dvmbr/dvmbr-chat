import { Prisma } from "@prisma/client";
import {
  UserSchema,
  UserSummarySchema,
  type UserDTO,
  type UserSummaryDTO,
} from "@/lib/schemas/user/schema";

export const userDTOSelect = {
  id: true,
  nickname: true,
  lastRoomId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const userSummaryDTOSelect = {
  id: true,
  nickname: true,
} satisfies Prisma.UserSelect;

export type UserDTOData = Prisma.UserGetPayload<{
  select: typeof userDTOSelect;
}>;

type UserSummaryDTOData = Prisma.UserGetPayload<{
  select: typeof userSummaryDTOSelect;
}>;

export function toUserDTO(data: UserDTOData): UserDTO {
  return UserSchema.parse({
    ...data,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  });
}

export function toUserSummaryDTO(data: UserSummaryDTOData): UserSummaryDTO {
  return UserSummarySchema.parse({
    ...data,
  });
}
