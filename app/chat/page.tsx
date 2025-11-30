import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import CreateRoomForm from "./CreateRoomForm";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import {getRooms} from "@/lib/room";
import {getLastMessagesForAllRooms} from "@/lib/message";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME!;

export default async function ChatPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (!session) {
    redirect("/login");
  }

  const rooms = await getRooms();
  const lastMessageMap = await getLastMessagesForAllRooms();

  return (
    <div className="h-full flex flex-col bg-bg-secondary text-text-primary">
      {/* HEADER - 위에 고정 */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <h1 className="text-2xl font-semibold">DVMBR CHAT APP</h1>
        <LogoutButton />
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
            <ul className="space-y-2">
              {rooms.map((room) => {
                const lastMessage = lastMessageMap?.[room.id];
                return (
                  <li key={room.id}>
                    <Link
                      href={`/chat/${room.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded-md bg-bg-secondary border border-surface-border hover:border-brand-mint hover:bg-surface-hover transition"
                    >
                      <div>
                        <p className="text-lg font-medium mb-2">{room.name}</p>
                        <p className="text-sm text-text-secondary">
                          {lastMessage ?? "아직 메시지가 없습니다."}
                        </p>
                        <p className="text-xs text-text-muted">
                          {room.createdAt.toLocaleString("ko-KR")}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
