import ChatRoomEntry from "@/components/ChatRoom/ChatRoomEntry";
import { notFound } from "next/navigation";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId: roomIdParam } = await params;
  const roomId = Number(roomIdParam);

  if (!Number.isInteger(roomId) || roomId <= 0) {
    notFound();
  }

  return <ChatRoomEntry roomId={roomId} />;
}
