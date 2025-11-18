import {cookies} from "next/headers";
import {redirect, notFound} from "next/navigation";
import {prisma} from "@/lib/db";
import RoomChatClient from "./RoomChatClient";

type RoomPageProps = {
  params: Promise<{roomId: string}>;
};

export default async function RoomPage(props: RoomPageProps) {
  const {roomId} = await props.params;
  if (!roomId) notFound();

  const cookieStore = await cookies();
  const session = cookieStore.get("chat_session");

  if (!session) redirect("/login");

  let sessionUser: {id: string; username: string} | null = null;

  try {
    sessionUser = JSON.parse(session.value);
  } catch {
    redirect("/login");
  }

  if (!sessionUser) redirect("/login");

  const room = await prisma.room.findUnique({
    where: {id: roomId},
  });

  if (!room) notFound();

  // 실제 메시지 목록 DB에서 조회
  const rawMessages = await prisma.message.findMany({
    where: {roomId},
    orderBy: {createdAt: "asc"},
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  // 클라이언트에 넘길 수 있는 형태로 가공 (Date => string)
  const messages = rawMessages.map((m) => ({
    id: m.id,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
    roomId: m.roomId,
    user: m.user,
  }));

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
            ← 채팅방 목록으로
          </a>
        </header>

        <RoomChatClient
          roomId={roomId}
          sessionUser={sessionUser}
          initialMessages={messages}
        />
      </div>
    </div>
  );
}
