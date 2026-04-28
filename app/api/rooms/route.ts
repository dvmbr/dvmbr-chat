import prisma from "@/lib/db";
import { toRoomListDTO } from "@/lib/schema/room.schema";
import { internalServerError } from "@/lib/utils/error-response";
import { getUserFromRequest } from "@/lib/utils/getUserFromRequest";
import { sendList } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const userId = user.id;

    const rooms = await prisma.room.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        creator: true,
      },
    });

    return sendList(toRoomListDTO(rooms));
  } catch (error) {
    return internalServerError(error);
  }
}
