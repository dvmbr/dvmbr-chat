import prisma from "@/lib/db";
import { toChatRoomEntryDTO } from "@/lib/schema/chat-room-entry.schema";
import { RoomWithCreator } from "@/lib/schema/room.schema";

import { internalServerError } from "@/lib/utils/error-response";
import { getUserFromRequest } from "@/lib/utils/getUserFromRequest";
import { sendOk } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const entry = await prisma.$transaction(async (tx) => {
      let room: RoomWithCreator | null = null;
      if (user.lastRoomId) {
        room = await tx.room.findUnique({
          where: { id: user.lastRoomId },
          include: {
            creator: true,
          },
        });
      }

      if (!room) {
        room = await tx.room.create({
          data: {
            name: `${user.nickname}'s room`,
            creatorId: user.id,
          },
          include: {
            creator: true,
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
        room: room,
      };
    });

    return sendOk(toChatRoomEntryDTO(entry));
  } catch (error) {
    return internalServerError(error);
  }
}
