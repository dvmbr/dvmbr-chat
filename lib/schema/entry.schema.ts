import { User } from "@prisma/client";
import { z } from "../zod";
import { toUserDTO, UserSchema } from "./user.schema";

export const EntrySchema = z
  .object({
    user: UserSchema,
    isNew: z.boolean(),
  })
  .openapi("Entry");

export const EntryBodySchema = z
  .object({
    nickname: z.string().trim().min(1),
  })
  .openapi("EntryBody");

export type Entry = {
  user: User;
  isNew: boolean;
};
export type EntryDTO = z.infer<typeof EntrySchema>;
export type EntryBodyDTO = z.infer<typeof EntryBodySchema>;

export function toEntryDTO(data: Entry): EntryDTO {
  return EntrySchema.parse({
    user: toUserDTO(data.user),
    isNew: data.isNew,
  });
}
