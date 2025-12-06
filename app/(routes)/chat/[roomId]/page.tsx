import {redirect, notFound} from "next/navigation";
import Link from "next/link";
import ChatRoom from "./components/ChatRoom";
import {getCurrentUser} from "@/app/(server)/lib/auth";
import {getMessagesByRoomId} from "@/app/(server)/lib/message";
import {getRoomByRoomId} from "@/app/(server)/lib/room";

type Props = {
  params: Promise<{roomId: string}>;
};

export default async function RoomPage({params}: Props) {
  const {roomId} = await params;
  if (!roomId) notFound();

  // 세션 검사
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/login");
  }

  // 방 정보 조회
  const room = await getRoomByRoomId(roomId);

  if (!room) {
    notFound();
  }

  // 공용 함수 사용해서 메시지 조회 (DB -> ChatMessage[])
  const messages = await getMessagesByRoomId(roomId);

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary">
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1 p-6">
        {/* 헤더 */}
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{room.name}</h1>
          <Link
            href="/chat"
            className="text-sm text-text-secondary hover:text-brand-mint"
          >
            {"<-"} 채팅방 목록으로
          </Link>
        </header>

        <ChatRoom roomId={roomId} user={sessionUser} messages={messages} />
      </div>
    </div>
  );
}
