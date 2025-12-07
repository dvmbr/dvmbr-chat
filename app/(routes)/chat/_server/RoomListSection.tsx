import {
  getLastMessagesForAllRooms,
  getUnreadCountsByRoom,
} from "@/app/(server)/lib/message";
import {getRooms} from "@/app/(server)/lib/room";
import RoomList from "../_client/RoomList";

type Params = {
  userId: string;
};

export default async function RoomListSection({userId}: Params) {
  const rooms = await getRooms();
  const lastMessageMap = await getLastMessagesForAllRooms();
  const unreadCountsMap = await getUnreadCountsByRoom(userId);
  return (
    <div className="px-4 pb-4 flex-1 overflow-y-auto">
      <div className="bg-surface border border-surface-border rounded-lg p-4">
        {rooms.length === 0 ? (
          <p className="text-text-secondary text-sm">
            아직 생성된 채팅방이 없습니다.
          </p>
        ) : (
          <RoomList
            rooms={rooms}
            lastMessageMap={lastMessageMap}
            unreadCountsMap={unreadCountsMap}
          />
        )}
      </div>
    </div>
  );
}
