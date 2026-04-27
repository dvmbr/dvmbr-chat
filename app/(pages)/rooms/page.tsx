import RoomList from "@/components/RoomList";
import { COOKIE_KEY } from "@/lib/constants/cookie-constants";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export default async function RoomsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEY)?.value;
  if (!token) return null;

  const user = await prisma.user.findUnique({
    where: { browserToken: token },
  });
  if (!user) return null;

  const rooms = await prisma.room.findMany({
    where: {
      participants: {
        some: {
          userId: user.id,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  // const rooms = result.map(toRoomWithCreatorDTO);

  return <RoomList rooms={rooms} />;
}
