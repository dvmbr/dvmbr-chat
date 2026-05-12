import prisma from "@/lib/server/db";
import {
  chatRoomEntryDTOSelect,
  toChatRoomEntryDTO,
} from "@/lib/mappers/chat-room-entry.mapper";
import { ChatRoomEntryParamsSchema } from "@/lib/schemas/chat-room-entry/request";
import {
  badRequest,
  internalServerError,
  notFound,
} from "@/lib/server/http/error-response";
import { getUserFromRequest } from "@/lib/server/auth/getUserFromRequest";
import { sendOk } from "@/lib/server/http/response";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/entry">,
) {
  try {
    const user = await getUserFromRequest(req);

    const p = await params;
    const parsedParams = ChatRoomEntryParamsSchema.safeParse({
      roomId: p.roomId,
    });
    if (!parsedParams.success) {
      return badRequest({
        message: "roomId as a positive integer in the URL path",
      });
    }

    const userId = user.id;
    const roomId = parsedParams.data.roomId;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      return notFound({
        message: "Room not found for the provided roomId",
      });
    }

    const chatRoomEntry = await prisma.$transaction(async (tx) => {
      const participant = await tx.participant.upsert({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
        update: {
          lastReadAt: new Date(),
        },
        create: {
          roomId,
          userId,
          lastReadAt: new Date(),
        },

        select: chatRoomEntryDTOSelect,
      });

      await tx.user.update({
        where: { id: userId },
        data: { lastRoomId: roomId },
      });

      return participant;
    });
    return sendOk(toChatRoomEntryDTO(chatRoomEntry));
  } catch (error) {
    return internalServerError(error);
  }
}
