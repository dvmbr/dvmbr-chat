import RoomList from "@/components/RoomList";
import prisma from "@/lib/db";
import { toRoomDto } from "@/lib/schema/room.schema";

export default async function RoomsPage() {
  const result = await prisma.room.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const rooms = result.map(toRoomDto);

  return (
    <div className="h-full">
      <RoomList rooms={rooms} />
    </div>
  );
}
