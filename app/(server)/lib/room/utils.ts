import {Room} from "@prisma/client";
import {
  LastMessageMap,
  UnreadCountMap,
  getLastMessagesForAllRooms,
  getUnreadCountsByRoom,
} from "../message/messageService";
import {getRooms} from "./roomService";

export type RoomListViewModel = {
  rooms: Room[];
  lastMessageMap: LastMessageMap;
  unreadCountsMap: UnreadCountMap;
};

// 채팅방 목록 + 최신 메시지 + 안 읽은 개수 한 번에 가져오기
export async function getRoomListViewModel(
  userId: string
): Promise<RoomListViewModel> {
  const [rooms, lastMessageMapRaw, unreadCountsMapRaw] = await Promise.all([
    getRooms(),
    getLastMessagesForAllRooms(),
    getUnreadCountsByRoom(userId),
  ]);

  return {
    rooms,
    lastMessageMap: lastMessageMapRaw ?? {},
    unreadCountsMap: unreadCountsMapRaw ?? {},
  };
}
