import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  ParticipantQuerySchema,
  toParticipantDto,
} from "@/lib/schema/participant.schema";
import { sendList, sendOk } from "@/lib/utils/response";
import { badRequest, notFound, serverError } from "@/lib/utils/error-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const parsedQuery = ParticipantQuerySchema.safeParse({
      id: searchParams.get("id") ?? undefined,
      userId: searchParams.get("userId") ?? undefined,
      roomId: searchParams.get("roomId") ?? undefined,
    });

    if (!parsedQuery.success) {
      return badRequest("Invalid query parameters", {
        expected: "{ id?: number, userId?: number, roomId?: number }",
      });
    }

    const { id, userId, roomId } = parsedQuery.data;

    if (id !== undefined) {
      const participant = await prisma.participant.findUnique({
        where: { id },
      });

      if (!participant) {
        return notFound("Participant");
      }

      return sendOk(toParticipantDto(participant));
    }

    if (userId !== undefined && roomId !== undefined) {
      const participant = await prisma.participant.findUnique({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
      });

      if (!participant) {
        return notFound("Participant");
      }

      return sendOk(toParticipantDto(participant));
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
  } catch {
    return serverError();
  }
}
