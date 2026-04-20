import { z } from "../openapi/zod";

export const EntrySchema = z
  .object({
    roomId: z.number(),
  })
  .openapi("Entry");

export const EntryQuerySchema = z
  .object({
    userId: z.coerce.number(),
  })
  .openapi("EntryQuery");

export const EntryRequestSchema = z
  .object({
    userId: z.number(),
  })
  .openapi("EntryRequest");

export type Entry = { roomId: number };
export type EntryDTO = z.infer<typeof EntrySchema>;
export type EntryQueryDTO = z.infer<typeof EntryQuerySchema>;
export type EntryRequestDTO = z.infer<typeof EntryRequestSchema>;

export function toEntryDto(entry: Entry): EntryDTO {
  return {
    ...entry,
  };
}
