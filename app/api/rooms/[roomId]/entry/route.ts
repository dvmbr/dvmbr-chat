import prisma from "@/lib/db";
import {
  ChatRoomEntryParamsSchema,
  toChatRoomEntryDTO,
} from "@/lib/schema/chat-room-entry.schema";

import {
  badRequest,
  internalServerError,
  notFound,
} from "@/lib/utils/error-response";
import { getUserFromRequest } from "@/lib/utils/getUserFromRequest";
import { sendOk } from "@/lib/utils/response";
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

    // REFACTOR: update room entry API to include creator info
    const room = await prisma.room.findUnique({
      where: { id: parsedParams.data.roomId },
      include: {
        creator: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
    if (!room) {
      return notFound({
        message: "Room not found for the provided roomId",
      });
    }
    const userId = user.id;
    const roomId = room.id;

    const chatRoomEntry = await prisma.$transaction(async (tx) => {
      const participant = await tx.participant.upsert({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
        update: {},
        create: {
          roomId,
          userId,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { lastRoomId: roomId },
      });

      return {
        roomId,
        participantId: participant.id,
        room,
      };
    });
    return sendOk(toChatRoomEntryDTO(chatRoomEntry));
  } catch (error) {
    return internalServerError(error);
  }
}
