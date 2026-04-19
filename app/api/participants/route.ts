import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  CreateParticipantSchema,
  ParticipantQuerySchema,
  toParticipantDto,
} from "@/lib/schema/participant.schema";
import { sendError, sendList, sendOk } from "@/lib/utils/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = ParticipantQuerySchema.safeParse({
      id: searchParams.get("id") ?? undefined,
      userId: searchParams.get("userId") ?? undefined,
      roomId: searchParams.get("roomId") ?? undefined,
    });

    if (!parsed.success) {
      return sendError(
        "Invalid query parameters: { id?:number, userId?:number, roomId?:number }",
        400,
      );
    }

    const { id, userId, roomId } = parsed.data;

    if (id !== undefined) {
      const participant = await prisma.participant.findUnique({
        where: { id },
      });

      return !participant
        ? sendError("Participant not found", 404)
        : sendOk(toParticipantDto(participant));
    }

    if (userId !== undefined && roomId !== undefined) {
      const participant = await prisma.participant.findFirst({
        where: {
          userId,
          roomId,
        },
      });

      return !participant
        ? sendError("Participant not found", 404)
        : sendOk(toParticipantDto(participant));
    }

    if (userId !== undefined) {
      const participants = await prisma.participant.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return sendList(participants.map(toParticipantDto));
    }

    if (roomId !== undefined) {
      const participants = await prisma.participant.findMany({
        where: { roomId },
        orderBy: { createdAt: "desc" },
      });

      return sendList(participants.map(toParticipantDto));
    }

    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: "desc" },
    });

    return sendList(participants.map(toParticipantDto));
  } catch (error) {
    console.error(error);
    return sendError("Failed to fetch participants", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = CreateParticipantSchema.safeParse(body);

    if (!parsed.success) {
      return sendError(
        "Invalid request body: { userId:number, roomId:number }",
        400,
      );
    }

    const { userId, roomId } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return sendError("User not found", 404);
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return sendError("Room not found", 404);
    }

    const participant = await prisma.participant.create({
      data: {
        userId,
        roomId,
      },
    });

    return sendOk(toParticipantDto(participant));
  } catch (error) {
    console.error(error);
    return sendError("Failed to create participant", 500);
  }
}
