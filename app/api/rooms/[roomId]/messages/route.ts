import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  MessageQuerySchema,
  MessageCreateBodySchema,
  toMessageDTO,
} from "@/lib/schema/message.schema";
import { EnterCookieSchema } from "@/lib/schema/entry.schema";
import { badRequest, notFound, serverError } from "@/lib/utils/error-response";
import { sendList, sendOk } from "@/lib/utils/response";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/messages">,
) {
  try {
    const { roomId: roomIdParam } = await params;
    const { searchParams } = new URL(req.url);

    const parsed = MessageQuerySchema.safeParse({
      roomId: roomIdParam,
      cursor: searchParams.get("cursor"),
      limit: searchParams.get("limit"),
    });

    if (!parsed.success) {
      return badRequest("Invalid query parameters", {
        expected: "{ roomId: number, cursor?: number, limit?: number }",
      });
    }

    const { roomId, cursor, limit } = parsed.data;

    const messages = await prisma.message.findMany({
      where: {
        roomId,
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: {
        id: "desc",
      },
      take: limit,
    });

    return sendList(messages.map(toMessageDTO));
  } catch {
    return serverError();
  }
}

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/messages">,
) {
  try {
    const { roomId: roomIdParam } = await params;

    const parsedRoomId = MessageQuerySchema.shape.roomId.safeParse(roomIdParam);

    if (!parsedRoomId.success) {
      return badRequest("Invalid roomId parameter", {
        expected: "{ roomId: number }",
      });
    }

    const cookieParsed = EnterCookieSchema.safeParse({
      userId: req.cookies.get("userId")?.value,
    });

    if (!cookieParsed.success || !cookieParsed.data.userId) {
      return badRequest("User cookie not found", {
        expected: "{ userId: number }",
      });
    }

    const body = await req.json();

    const parsedBody = MessageCreateBodySchema.safeParse(body);

    if (!parsedBody.success) {
      return badRequest("Invalid request body", {
        expected: "{ content: string, type?: TEXT | IMAGE | SYSTEM }",
      });
    }

    const roomId = parsedRoomId.data;
    const { content, type } = parsedBody.data;
    const userId = cookieParsed.data.userId;

    const participant = await prisma.participant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!participant) {
      return notFound("Participant not found");
    }

    const message = await prisma.message.create({
      data: {
        participantId: participant.id,
        roomId,
        content,
        type,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        lastRoomId: roomId,
      },
    });

    return sendOk(toMessageDTO(message));
  } catch {
    return serverError();
  }
}
