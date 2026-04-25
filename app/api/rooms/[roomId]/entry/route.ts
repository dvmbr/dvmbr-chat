import prisma from "@/lib/db";
import {
  ChatRoomEntryParamsSchema,
  toChatRoomEntryDTO,
} from "@/lib/schema/chat-room-entry.schema";

import {
  badRequest,
  internalServerError,
  notFound,
  unauthorized,
} from "@/lib/utils/error-response";
import { sendOk } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { roomId: string } },
) {
  try {
    const token = req.cookies.get("browserToken")?.value;
    if (!token) {
      return unauthorized({
        message: "Missing browserToken cookie",
      });
    }

    const user = await prisma.user.findUnique({
      where: { browserToken: token },
    });
    if (!user) {
      return notFound({
        message: "User not found for the provided browserToken",
      });
    }

    const parsedParams = ChatRoomEntryParamsSchema.safeParse({
      roomId: params.roomId,
    });
    if (!parsedParams.success) {
      return badRequest({
        expected: "roomId as a positive integer in the URL path",
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: parsedParams.data.roomId },
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
      };
    });
    return sendOk(toChatRoomEntryDTO(chatRoomEntry));
  } catch (error) {
    return internalServerError(error);
  }
}
