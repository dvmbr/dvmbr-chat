import { toUserDTO, type UserDTOData } from "@/lib/mappers/user.mapper";
import { EntrySchema, type EntryDTO } from "@/lib/schemas/entry/schema";

type EntryDTOData = {
  user: UserDTOData;
};

export function toEntryDTO(data: EntryDTOData): EntryDTO {
  return EntrySchema.parse({
    user: toUserDTO(data.user),
  });
}
