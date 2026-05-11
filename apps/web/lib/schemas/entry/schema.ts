import { z } from "../../zod";
import { UserSchema } from "../user/schema";

export const EntrySchema = z
  .object({
    user: UserSchema,
  })
  .openapi("Entry");

export type EntryDTO = z.infer<typeof EntrySchema>;
