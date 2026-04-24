import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { EnterCookieSchema } from "@/lib/schema/entry.schema";
import { RoomParamSchema } from "@/lib/schema/room.schema";
import { badRequest, notFound, serverError } from "@/lib/utils/error-response";
import { sendOk } from "@/lib/utils/response";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/entry">,
) {
  try {
    // 1. user 확인
    const cookieParsed = EnterCookieSchema.safeParse({
      userId: req.cookies.get("userId")?.value,
    });

    if (!cookieParsed.success || !cookieParsed.data.userId) {
      return badRequest("User cookie not found");
    }

    const userId = cookieParsed.data.userId;

    // 2. roomId 파싱
    const parsedParams = RoomParamSchema.safeParse(await params);

    if (!parsedParams.success) {
      return badRequest("Invalid roomId");
    }

    const roomId = parsedParams.data.roomId;

    // 3. 방 존재 확인
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return notFound("Room");
    }

    // 4. participant 확인
    let participant = await prisma.participant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    // 5. 없으면 생성
    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          userId,
          roomId,
        },
      });
    }

    // 6. lastRoomId 업데이트
    await prisma.user.update({
      where: { id: userId },
      data: { lastRoomId: roomId },
    });

    return sendOk({
      userId,
      roomId,
      participantId: participant.id,
    });
  } catch {
    return serverError();
  }
}
