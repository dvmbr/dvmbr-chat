import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import CreateRoomForm from "./components/CreateRoomForm";
import LogoutButton from "./components/LogoutButton";
import {getRooms} from "@/lib/room";
import {getLastMessagesForAllRooms, getUnreadCountsByRoom} from "@/lib/message";
import RoomList from "./components/RoomList";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME!;

export default async function ChatPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session) {
    redirect("/login");
  }

  const user = JSON.parse(session.value);
  const userId = user.id;
  const userName = user.name;

  const rooms = await getRooms();
  const lastMessageMap = await getLastMessagesForAllRooms();
  const unreadCountsMap = await getUnreadCountsByRoom(userId);

  return (
    <div className="h-full flex flex-col bg-bg-secondary text-text-primary">
      {/* HEADER - 위에 고정 */}
      <div className="flex items-center justify-between px-4 py-6 shrink-0">
        <h1 className="text-2xl font-semibold">DVMBR CHAT APP</h1>
        <LogoutButton userName={userName} />
      </div>

      {/* 새 방 생성 폼 - 이것도 고정 영역 */}
      <div className="px-4 pb-2 shrink-0">
        <CreateRoomForm />
      </div>

      {/* 방 목록만 스크롤 */}
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
    </div>
  );
}
