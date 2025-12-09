import {Room} from "@prisma/client";
import {MessageDTO} from "../message/messageDTO";

export type RoomDTO = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  hostId: string;
  unreadCount: number;
  lastMessage?: {
    id: string;
    text: string;
    userId: string;
    userName: string;
    createdAt: Date;
  };
};

export function toRoomDTO({
  room,
  lastMessage,
  unreadCount,
}: {
  room: Room;
  lastMessage?: MessageDTO | null;
  unreadCount?: number;
}): RoomDTO {
  return {
    id: room.id,
    name: room.name,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    hostId: room.hostId,
    unreadCount: unreadCount ?? 0,
    ...(lastMessage && {
      lastMessage: {
        id: lastMessage.id,
        text: lastMessage.text,
        userId: lastMessage.userId,
        userName: lastMessage.userName,
        createdAt: lastMessage.createdAt,
      },
    }),
  };
}
