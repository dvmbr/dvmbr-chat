import { z } from "zod";

export const AiModeChangedPayloadSchema = z.object({
  roomId: z.number().int().positive(),
  isAiMode: z.boolean(),
});

export type AiModeChangedPayload = z.infer<typeof AiModeChangedPayloadSchema>;
