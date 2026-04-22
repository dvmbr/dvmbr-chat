import { NextRequest } from "next/server";
import prisma from "@/lib/db";

import {
  RoomEntryParamSchema,
  toRoomEntryDto,
} from "@/lib/schema/room-entry.schema";
import { sendOk } from "@/lib/utils/response";
import {
  badRequest,
  unauthorized,
  notFound,
  serverError,
} from "@/lib/utils/error-response";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/entry">,
) {
  try {
    const parsedParams = RoomEntryParamSchema.safeParse(await params);

    if (!parsedParams.success) {
      return badRequest("Invalid route parameter", {
        expected: "{ roomId: number }",
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: parsedParams.data.roomId },
    });

    if (!room) {
      return notFound("Room");
    }

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

    const participant = await prisma.participant.upsert({
      where: {
        userId_roomId: {
          userId: user.id,
          roomId: parsedParams.data.roomId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roomId: parsedParams.data.roomId,
      },
    });

    return sendOk(
      toRoomEntryDto({
        roomId: parsedParams.data.roomId,
        participantId: participant.id,
      }),
      200,
      "Room entered successfully",
    );
  } catch {
    return serverError();
  }
}
