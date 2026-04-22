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
  participant: z.object({
    id: z.number(),
    userId: z.number(),
    roomId: z.number(),
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
  participant: {
    id: number;
    userId: number;
    roomId: number;
  };
};
export type EntryDTO = z.infer<typeof EntrySchema>;
export type EntryRequestDTO = z.infer<typeof EntryRequestSchema>;

export function toEntryDto(entry: Entry): EntryDTO {
  return {
    ...entry,
  };
}
