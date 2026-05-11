import { z } from "zod";

export const SocketConnectionQuerySchema = z.object({
  userId: z.coerce.number().int().positive(),
  roomId: z.coerce.number().int().positive().optional(),
});

export type SocketConnectionQuery = z.infer<typeof SocketConnectionQuerySchema>;
