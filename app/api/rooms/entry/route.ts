import prisma from "@/lib/db";
import { toChatRoomEntryDTO } from "@/lib/schema/chat-room-entry.schema";

import {
  internalServerError,
  notFound,
  unauthorized,
} from "@/lib/utils/error-response";
import { sendOk } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
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

    const entry = await prisma.$transaction(async (tx) => {
      let room = null;
      if (user.lastRoomId) {
        room = await tx.room.findUnique({
          where: { id: user.lastRoomId },
        });
      }

      if (!room) {
        room = await tx.room.create({
          data: {
            name: `${user.nickname}'s room`,
            creatorId: user.id,
          },
        });
      }

      const participant = await tx.participant.upsert({
        where: {
          userId_roomId: {
            userId: user.id,
            roomId: room.id,
          },
        },
        update: {},
        create: {
          roomId: room.id,
          userId: user.id,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { lastRoomId: room.id },
      });

      return {
        roomId: room.id,
        participantId: participant.id,
      };
    });

    return sendOk(toChatRoomEntryDTO(entry));
  } catch (error) {
    return internalServerError(error);
  }
}
