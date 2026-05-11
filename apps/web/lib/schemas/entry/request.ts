import { z } from "../../zod";

export const EntryBodySchema = z
  .object({
    nickname: z.string().trim().min(1),
  })
  .openapi("EntryBody");

export type EntryBody = z.infer<typeof EntryBodySchema>;
