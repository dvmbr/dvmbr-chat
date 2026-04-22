import prisma from "@/lib/db";
import {
  CreateMessageSchema,
  RoomParamSchema,
  toMessageDto,
} from "@/lib/schema/message.schema";
import { sendError, sendOk } from "@/lib/utils/response";
import { NextRequest } from "next/server";

type RouteContext = {
  params: Promise<{
    roomId: string;
  }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;

    const parsedParams = RoomParamSchema.safeParse(params);

    if (!parsedParams.success) {
      return sendError("Invalid route parameter: { roomId:number }", 400);
    }

    const messages = await prisma.message.findMany({
      where: { roomId: parsedParams.data.roomId },
      orderBy: { createdAt: "asc" },
    });

    return sendOk(messages.map(toMessageDto));
  } catch (error) {
    return sendError(error, 500);
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;

    const parsedParams = RoomParamSchema.safeParse(params);

    if (!parsedParams.success) {
      return sendError("Invalid route parameter: { roomId:number }", 400);
    }

    const body = await req.json();
    const parsedBody = CreateMessageSchema.safeParse(body);

    if (!parsedBody.success) {
      return sendError(
        "Invalid route parameter: { participantId:number, content:string, type?:'TEXT'|'IMAGE'|'SYSTEM' }",
        400,
      );
    }

    const participant = await prisma.participant.findUnique({
      where: { id: parsedBody.data.participantId },
    });

    if (!participant) {
      return sendError("Participant not found", 404);
    }

    if (participant.roomId !== parsedParams.data.roomId) {
      return sendError("Participant does not belong to this room", 400);
    }

    const message = await prisma.message.create({
      data: {
        participantId: participant.id,
        roomId: parsedParams.data.roomId,
        content: parsedBody.data.content,
        type: parsedBody.data.type ?? "TEXT",
      },
    });

    return sendOk(toMessageDto(message));
  } catch (error) {
    return sendError(error, 500);
  }
}
