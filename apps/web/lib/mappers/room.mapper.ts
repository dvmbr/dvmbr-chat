import { Prisma } from "@prisma/client";
import { userSummaryDTOSelect } from "./user.mapper";
import { RoomSchema, type RoomDTO } from "@/lib/schemas/room/schema";

export const roomDTOSelect = {
  id: true,
  name: true,
  isAiMode: true,
  creator: {
    select: userSummaryDTOSelect,
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RoomSelect;

export type RoomDTOData = Prisma.RoomGetPayload<{
  select: typeof roomDTOSelect;
}> & {
  unreadCount?: number;
  isAiMode?: boolean;
};

export function toRoomDTO(data: RoomDTOData): RoomDTO {
  return RoomSchema.parse({
    ...data,
    unreadCount: data.unreadCount ?? 0,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  });
}

export function toRoomListDTO(data: RoomDTOData[]): RoomDTO[] {
  return data.map(toRoomDTO);
}
