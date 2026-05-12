import prisma from "@/lib/server/db";
import { postUnreadCount } from "@/lib/server/socket/api/unread-count.api";

import {
  badRequest,
  forbidden,
  internalServerError,
} from "@/lib/server/http/error-response";
import { getUserFromRequest } from "@/lib/server/auth/getUserFromRequest";
import { sendOk } from "@/lib/server/http/response";
import { NextRequest } from "next/server";
import { RoomParamsSchema } from "@/lib/schemas/room/request";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/read">,
) {
  try {
    const user = await getUserFromRequest(req);

    const p = await params;
    const parsedParams = RoomParamsSchema.safeParse(p);

    if (!parsedParams.success) {
      return badRequest({
        message: "roomId must be a positive integer",
      });
    }

    const userId = user.id;
    const roomId = parsedParams.data.roomId;
    const result = await prisma.participant.updateMany({
      where: {
        userId,
        roomId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    if (result.count === 0) {
      return forbidden({
        message: "Participant not found",
      });
    }

    try {
      await postUnreadCount([{ userId, roomId, unreadCount: 0 }]);
    } catch (error) {
      console.error("Failed to post unread count reset", error);
    }

    return sendOk(null);
  } catch (error) {
    return internalServerError(error);
  }
}
