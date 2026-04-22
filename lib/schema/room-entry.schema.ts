import { z } from "../openapi/zod";

export const RoomEntrySchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
    participantId: z.coerce.number().int().positive(),
  })
  .openapi("RoomEntry");

export const RoomEntryParamSchema = z
  .object({
    roomId: z.coerce.number().int().positive(),
  })
  .openapi("RoomEntryParam");

export type RoomEntryDto = z.infer<typeof RoomEntrySchema>;
export type RoomEntryParamDto = z.infer<typeof RoomEntryParamSchema>;

type RoomEntry = {
  roomId: number;
  participantId: number;
};

export function toRoomEntryDto(roomEntry: RoomEntry): RoomEntryDto {
  return RoomEntrySchema.parse({
    roomId: roomEntry.roomId,
    participantId: roomEntry.participantId,
  });
}
