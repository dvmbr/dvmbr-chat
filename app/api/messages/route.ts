import prisma from "@/lib/db";
import {
  CreateMessageSchema,
  MessageQuerySchema,
  toMessageDto,
} from "@/lib/schema/message.schema";
import { sendError, sendOk } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = MessageQuerySchema.safeParse({
      id: searchParams.get("id") ?? undefined,
      participantId: searchParams.get("participantId") ?? undefined,
      roomId: searchParams.get("roomId") ?? undefined,
    });

    if (!parsed.success) {
      return sendError(
        "Invalid query parameters: { id?:number, participantId?:number, roomId?:number }",
        400,
      );
    }

    if (parsed.data.id !== undefined) {
      const message = await prisma.message.findUnique({
        where: { id: parsed.data.id },
      });

      return !message
        ? sendError("Message not found", 404)
        : sendOk(toMessageDto(message));
    }

    if (parsed.data.participantId !== undefined) {
      const messages = await prisma.message.findMany({
        where: { participantId: parsed.data.participantId },
        orderBy: { createdAt: "asc" },
      });

      return sendOk(messages.map(toMessageDto));
    }

    if (parsed.data.roomId !== undefined) {
      const messages = await prisma.message.findMany({
        where: { roomId: parsed.data.roomId },
        orderBy: { createdAt: "asc" },
      });

      return sendOk(messages.map(toMessageDto));
    }

    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "asc" },
    });
    return sendOk(messages.map(toMessageDto));
  } catch (error) {
    return sendError(error, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateMessageSchema.safeParse(body);

    if (!parsed.success) {
      return sendError(
        "Invalid request body: { participantId:number, content:string, type?:'TEXT'|'IMAGE'|'SYSTEM' }",
        400,
      );
    }

    const participant = await prisma.participant.findUnique({
      where: { id: parsed.data.participantId },
    });

    if (!participant) {
      return sendError("Participant not found", 404);
    }

    const message = await prisma.message.create({
      data: {
        participantId: participant.id,
        roomId: participant.roomId,
        content: parsed.data.content,
        type: parsed.data.type ?? "TEXT",
      },
    });

    return sendOk(toMessageDto(message));
  } catch (error) {
    return sendError(error, 500);
  }
}
