import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {prisma} from "@/lib/db";
import CreateRoomForm from "./CreateRoomForm";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function ChatPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("chat_session");

  if (!session) {
    redirect("/login");
  }

  const rooms = await prisma.room.findMany({
    orderBy: {createdAt: "desc"},
  });

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-3xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">채팅방</h1>
          <LogoutButton />
        </div>

        {/* 새 방 생성 폼 */}
        <CreateRoomForm />

        {/* 방 목록 */}
        <div className="bg-surface border border-surface-border rounded-lg p-4">
          {rooms.length === 0 ? (
            <p className="text-text-secondary text-sm">
              아직 생성된 채팅방이 없습니다.
            </p>
          ) : (
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li key={room.id}>
                  <Link
                    href={`/chat/${room.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-md bg-bg-secondary border border-surface-border hover:border-brand-mint hover:bg-surface-hover transition"
                  >
                    <div>
                      <p className="text-sm font-medium">{room.name}</p>
                      <p className="text-xs text-text-muted">
                        {room.createdAt.toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
