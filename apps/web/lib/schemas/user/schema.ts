import { z } from "../../zod";

export const UserSchema = z
  .object({
    id: z.number().int().positive(),
    nickname: z.string().trim().min(1),
    lastRoomId: z.number().int().positive().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("User");

export const UserSummarySchema = z
  .object({
    id: z.number().int().positive(),
    nickname: z.string().trim().min(1),
  })
  .openapi("UserSummary");

export type UserDTO = z.infer<typeof UserSchema>;
export type UserSummaryDTO = z.infer<typeof UserSummarySchema>;
