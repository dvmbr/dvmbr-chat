import {cookies} from "next/headers";
import {redirect, notFound} from "next/navigation";
import {getMessagesByRoomId} from "@/lib/message";
import {getRoomByRoomId} from "@/lib/room";
import ChatView from "./ChatView";
import {SessionUser} from "@/types/session";

type Props = {
  params: Promise<{roomId: string}>;
};

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME!;

export default async function RoomPage({params}: Props) {
  const {roomId} = await params;
  if (!roomId) notFound();

  // 세션 검사
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session) {
    redirect("/login");
  }

  let sessionUser: SessionUser = null;

  try {
    sessionUser = JSON.parse(session.value);
  } catch {
    redirect("/login");
  }

  if (!sessionUser) {
    redirect("/login");
  }

  // 방 정보 조회
  const room = await getRoomByRoomId(roomId);

  if (!room) {
    notFound();
  }

  // 공용 함수 사용해서 메시지 조회 (DB -> ChatMessage[])
  const messagesFromServer = await getMessagesByRoomId(roomId);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1 p-6">
        {/* 헤더 */}
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{room.name}</h1>
          <a
            href="/chat"
            className="text-sm text-text-secondary hover:text-brand-mint"
          >
            {"<-"} 채팅방 목록으로
          </a>
        </header>

        <ChatView
          roomId={roomId}
          sessionUser={sessionUser}
          messages={messagesFromServer}
        />
      </div>
    </div>
  );
}
