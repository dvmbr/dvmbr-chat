import { z } from "../openapi/zod";

export const EntrySchema = z.object({
  room: z.object({
    id: z.number(),
    name: z.string(),
  }),
  user: z.object({
    id: z.number(),
    nickname: z.string(),
  }),
});

export const EntryRequestSchema = z
  .object({
    userId: z.number(),
  })
  .openapi("EntryRequest");

export type Entry = {
  room: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    nickname: string;
  };
};
export type EntryDTO = z.infer<typeof EntrySchema>;
export type EntryRequestDTO = z.infer<typeof EntryRequestSchema>;

export function toEntryDto(entry: Entry): EntryDTO {
  return {
    ...entry,
  };
}
