import RoomsContainer from "@/components/client/Rooms/RoomsContainer";
import ErrorView from "@/components/ui/ErrorView";
import { COOKIE_KEY } from "@/lib/constants/cookie-constants";
import { toRoomListDTO } from "@/lib/mappers/room.mapper";
import prisma from "@/lib/server/db";
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
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      creator: true,
      participants: {
        where: {
          userId: user.id,
        },
        select: { lastReadAt: true },
      },
    },
  });

  const RoomsWithUnreadCount = await Promise.all(
    rooms.map(async (r) => {
      const lastReadAt = r.participants[0]?.lastReadAt ?? new Date(0);

      const unreadCount = await prisma.message.count({
        where: {
          roomId: r.id,

          createdAt: {
            gt: lastReadAt,
          },

          participant: {
            userId: { not: user.id },
          },
        },
      });

      return { ...r, unreadCount };
    }),
  );

  return <RoomsContainer rooms={toRoomListDTO(RoomsWithUnreadCount)} />;
}
