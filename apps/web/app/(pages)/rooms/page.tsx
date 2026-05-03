import RoomsContainer from "@/components/client/Rooms/RoomsContainer";
import ErrorView from "@/components/ui/ErrorView";
import { COOKIE_KEY } from "@/lib/constants/cookie-constants";
import prisma from "@/lib/db";
import { RoomSchema, toRoomListDTO } from "@/lib/schema/room.schema";
import { cookies } from "next/headers";

export default async function RoomsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEY)?.value;
  if (!token) return <ErrorView text="Token not found" />;

  const user = await prisma.user.findUnique({
    where: { browserToken: token },
  });
  if (!user) return <ErrorView text="User not found" />;

  const rooms = await prisma.room.findMany({
    // where: {
    //   participants: {
    //     some: {
    //       userId: user.id,
    //     },
    //   },
    // },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      creator: true,
    },
  });

  return <RoomsContainer rooms={toRoomListDTO(rooms)} />;
}
