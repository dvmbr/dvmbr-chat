import { z } from "../../zod";
import { UserSummarySchema } from "../user/schema";

export const MessageSchema = z
  .object({
    id: z.number().int().positive(),
    participantId: z.number().int().positive(),
    sender: UserSummarySchema,
    roomId: z.number().int().positive(),
    content: z.string().trim().min(1),
    type: z.enum(["TEXT", "IMAGE", "SYSTEM"]),
    isDeleted: z.boolean(),
    isEdited: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi("Message");

export type MessageDTO = z.infer<typeof MessageSchema>;
