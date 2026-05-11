import prisma from "@/lib/server/db";

import { internalServerError } from "@/lib/server/http/error-response";
import { getUserFromRequest } from "@/lib/server/auth/getUserFromRequest";
import { sendOk } from "@/lib/server/http/response";
import { NextRequest } from "next/server";
import { toChatRoomEntryDTO } from "@/lib/mappers/chat-room-entry.mapper";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const entry = await prisma.$transaction(async (tx) => {
      let room = null;
      if (user.lastRoomId) {
        room = await tx.room.findUnique({
          where: { id: user.lastRoomId },
          include: {
            creator: true,
          },
        });
      }

      if (!room) {
        const latestUser = await tx.user.findUnique({
          where: { id: user.id },
        });

        if (latestUser?.lastRoomId) {
          room = await tx.room.findUnique({
            where: { id: latestUser.lastRoomId },

            include: { creator: true },
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
            include: {
              creator: true,
            },
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
