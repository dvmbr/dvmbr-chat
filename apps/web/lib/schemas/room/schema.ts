import { z } from "../../zod";
import { UserSummarySchema } from "../user/schema";

export const RoomSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string().trim().min(1),
    creator: UserSummarySchema,
    unreadCount: z.number().int().nonnegative(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Room");

export type RoomDTO = z.infer<typeof RoomSchema>;
