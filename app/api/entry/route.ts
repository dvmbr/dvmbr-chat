import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  EnterChatCreateBodySchema,
  EnterCookieSchema,
} from "@/lib/schema/entry.schema";
import { badRequest, notFound, serverError } from "@/lib/utils/error-response";
import { sendOk } from "@/lib/utils/response";

export async function GET(req: NextRequest) {
  try {
    const parsed = EnterCookieSchema.safeParse({
      userId: req.cookies.get("userId")?.value,
    });

    if (!parsed.success || !parsed.data.userId) {
      return badRequest("User cookie not found", {
        expected: "{ userId: number }",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: parsed.data.userId },

      select: {
        id: true,

        lastRoomId: true,
      },
    });

    if (!user) {
      return notFound("User not found");
    }

    if (!user.lastRoomId) {
      return notFound("Last room not found");
    }

    const participant = await prisma.participant.findUnique({
      where: {
        userId_roomId: {
          userId: user.id,
          roomId: user.lastRoomId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!participant) {
      return notFound("Participant not found");
    }

    return sendOk({
      userId: user.id,
      roomId: user.lastRoomId,
      participantId: participant.id,
    });
  } catch {
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = EnterChatCreateBodySchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid request body", {
        expected: "{ nickname: string }",
      });
    }

    const { nickname } = parsed.data;

    // 1. 모든 생성을 하나의 트랜잭션으로 묶음
    const result = await prisma.$transaction(async (tx) => {
      // 유저 생성
      const user = await tx.user.create({
        data: { nickname },
      });

      // 방 생성
      const room = await tx.room.create({
        data: {
          name: `${nickname}'s room`,
          creatorId: user.id,
        },
      });

      // 참가자 생성
      const participant = await tx.participant.create({
        data: {
          userId: user.id,
          roomId: room.id,
        },
      });

      // 유저의 lastRoomId 업데이트
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { lastRoomId: room.id },
      });

      return {
        userId: updatedUser.id,
        roomId: room.id,
        participantId: participant.id,
      };
    });

    // 2. 응답 구성 및 쿠키 설정
    const res = sendOk(result);

    res.cookies.set("userId", String(result.userId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Entry Transaction Error:", error);
    return serverError();
  }
}
