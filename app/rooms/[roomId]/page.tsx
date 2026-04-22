import ChatGate from "@/components/ChatGate";
import { notFound } from "next/navigation";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId: roomIdParam } = await params;
  const roomId = Number(roomIdParam);

  if (Number.isNaN(roomId)) {
    notFound();
  }

  return <ChatGate roomId={roomId} />;
}
