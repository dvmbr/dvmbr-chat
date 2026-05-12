import { MessageTypeSchema } from "@dvmbr/shared/socket";
import { z } from "../../zod";

export const MessageParamsSchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("MessageParams");

export const MessageCreateBodySchema = z
  .object({
    content: z.string().trim().min(1),
    type: MessageTypeSchema,
  })
  .openapi("MessageCreateBody");

export type MessageParams = z.infer<typeof MessageParamsSchema>;
export type MessageCreateBody = z.infer<typeof MessageCreateBodySchema>;
