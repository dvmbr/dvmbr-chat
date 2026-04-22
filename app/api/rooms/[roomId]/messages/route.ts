import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  CreateMessageSchema,
  RoomMessageParamSchema,
  toMessageDto,
} from "@/lib/schema/message.schema";
import { sendList, sendOk } from "@/lib/utils/response";
import {
  badRequest,
  unauthorized,
  serverError,
} from "@/lib/utils/error-response";

export async function GET(
  _req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/messages">,
) {
  try {
    const parsedParams = RoomMessageParamSchema.safeParse(await params);

    if (!parsedParams.success) {
      return badRequest("Invalid route parameter", {
        expected: "{ roomId: number }",
      });
    }

    const messages = await prisma.message.findMany({
      where: { roomId: parsedParams.data.roomId },
      orderBy: { createdAt: "asc" },
    });

    return sendList(messages.map(toMessageDto));
  } catch {
    return serverError();
  }
}

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/messages">,
) {
  try {
    const parsedParams = RoomMessageParamSchema.safeParse(await params);

    if (!parsedParams.success) {
      return badRequest("Invalid route parameter", {
        expected: "{ roomId: number }",
      });
    }

    const parsedBody = CreateMessageSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return badRequest("Invalid request body", {
        expected: "{ content: string, type?: 'TEXT' | 'IMAGE' | 'SYSTEM' }",
      });
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

    const participant = await prisma.participant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId: parsedParams.data.roomId,
        },
      },
    });

    if (!participant) {
      return badRequest("User is not a participant of this room", {
        expected: `{ userId: number (must enter roomId ${parsedParams.data.roomId} first) }`,
      });
    }

    const message = await prisma.message.create({
      data: {
        participantId: participant.id,
        roomId: parsedParams.data.roomId,
        content: parsedBody.data.content,
        type: parsedBody.data.type ?? "TEXT",
      },
    });

    return sendOk(toMessageDto(message), 201, "Message created");
  } catch {
    return serverError();
  }
}
