import RoomList from "@/components/RoomList";
import prisma from "@/lib/db";
import { toRoomWithCreatorDTO } from "@/lib/schema/room.schema";

export default async function RoomsPage() {
  const result = await prisma.room.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      creator: true,
    },
  });
  const rooms = result.map(toRoomWithCreatorDTO);

  return (
    <div className="h-full">
      <RoomList rooms={rooms} />
    </div>
  );
}
