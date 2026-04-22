import { NextRequest } from "next/server";
import prisma from "@/lib/db";

import { toChatEntryDto } from "@/lib/schema/chat-entry.schema";
import { sendOk } from "@/lib/utils/response";
import {
  unauthorized,
  notFound,
  serverError,
} from "@/lib/utils/error-response";

export async function POST(req: NextRequest) {
  try {
    const userIdValue = req.cookies.get("userId")?.value;

    if (!userIdValue) {
      return unauthorized({
        reason: "Missing userId cookie",
      });
    }

    const userId = Number(userIdValue);

    if (!Number.isInteger(userId) || userId <= 0) {
      return unauthorized({
        reason: "Invalid userId cookie",
        expected: "{ userId: number (positive integer) }",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return notFound("User");
    }

    const participant = await prisma.participant.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        room: true,
      },
    });

    if (participant) {
      return sendOk(
        toChatEntryDto({
          room: {
            id: participant.room.id,
            name: participant.room.name,
          },
          user: {
            id: user.id,
            nickname: user.nickname,
          },
          participant: {
            id: participant.id,
            userId: participant.userId,
            roomId: participant.roomId,
          },
        }),
      );
    }

    const createdRoom = await prisma.room.create({
      data: {
        name: `${user.nickname}'s room`,
        creatorId: user.id,
        participants: {
          create: {
            userId: user.id,
          },
        },
      },
      include: {
        participants: true,
      },
    });

    return sendOk(
      toChatEntryDto({
        room: {
          id: createdRoom.id,
          name: createdRoom.name,
        },
        user: {
          id: user.id,
          nickname: user.nickname,
        },
        participant: {
          id: createdRoom.participants[0].id,
          userId: createdRoom.participants[0].userId,
          roomId: createdRoom.participants[0].roomId,
        },
      }),
    );
  } catch {
    return serverError();
  }
}
