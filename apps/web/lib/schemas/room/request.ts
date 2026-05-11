import { z } from "../../zod";

export const RoomCreateBodySchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .openapi("RoomCreateBody");

export const RoomUpdateBodySchema = z
  .object({
    name: z.string().trim().min(1),
  })
  .openapi("RoomUpdateBody");

export const RoomParamsSchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("RoomParams");

export type RoomCreateBody = z.infer<typeof RoomCreateBodySchema>;
export type RoomUpdateBody = z.infer<typeof RoomUpdateBodySchema>;
