import ChatRoomEntry from "@/components/client/ChatRoom/ChatRoomEntry";
import { notFound } from "next/navigation";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const p = await params;
  const roomId = Number(p.roomId);

  if (!Number.isInteger(roomId) || roomId <= 0) {
    notFound();
  }

  return <ChatRoomEntry roomId={roomId} />;
}
