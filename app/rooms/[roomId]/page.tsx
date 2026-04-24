import EntryGate from "@/components/EntryGate";
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

  return <EntryGate roomId={roomId} />;
}
