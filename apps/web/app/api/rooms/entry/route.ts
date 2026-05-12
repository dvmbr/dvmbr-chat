import prisma from "@/lib/server/db";

import { internalServerError } from "@/lib/server/http/error-response";
import { getUserFromRequest } from "@/lib/server/auth/getUserFromRequest";
import { sendOk } from "@/lib/server/http/response";
import { NextRequest } from "next/server";
import {
  chatRoomEntryDTOSelect,
  toChatRoomEntryDTO,
} from "@/lib/mappers/chat-room-entry.mapper";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const entry = await prisma.$transaction(async (tx) => {
      let room = null;

      if (user.lastRoomId) {
        room = await tx.room.findUnique({
          where: { id: user.lastRoomId },
          select: { id: true },
        });
      }

      if (!room) {
        const latestUser = await tx.user.findUnique({
          where: { id: user.id },
          select: { lastRoomId: true },
        });

        if (latestUser?.lastRoomId) {
          room = await tx.room.findUnique({
            where: { id: latestUser.lastRoomId },
            select: { id: true },
          });
        }

        if (!room) {
          const newRoomName = `${user.nickname}'s room`;

          room = await tx.room.upsert({
            where: { name: newRoomName },
            update: {},
            create: {
              name: newRoomName,
              creatorId: user.id,
            },
            select: { id: true },
          });
        }
      }

      const participant = await tx.participant.upsert({
        where: {
          userId_roomId: {
            userId: user.id,
            roomId: room.id,
          },
        },
        update: {
          lastReadAt: new Date(),
        },
        create: {
          roomId: room.id,
          userId: user.id,
          lastReadAt: new Date(),
        },

        select: chatRoomEntryDTOSelect,
      });

      await tx.user.update({
        where: { id: user.id },
        data: { lastRoomId: room.id },
      });

      return participant;
    });

    return sendOk(toChatRoomEntryDTO(entry));
  } catch (error) {
    return internalServerError(error);
  }
}
