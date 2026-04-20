import { NextRequest } from "next/server";
import { EntryRequestSchema, toEntryDto } from "@/lib/schema/entry.schema";
import prisma from "@/lib/db";
import { sendError, sendOk } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = EntryRequestSchema.safeParse(body);

    if (!parsed.success) {
      return sendError("Invalid request body: { userId:number }", 400);
    }

    const { userId } = parsed.data;

    // For testing error handling in frontend
    if (userId === -1) {
      return sendError("Error test", 400);
    }

    // 1. check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return sendError("User not found", 404);
    }

    // 2. check participant exists
    const participant = await prisma.participant.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (participant) {
      return sendOk(toEntryDto({ roomId: participant.roomId }));
    }

    // 3. if not, create a new room + participant
    const createdRoom = await prisma.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          name: `room-${user.id}`,
        },
      });

      await tx.participant.create({
        data: {
          userId: user.id,
          roomId: room.id,
        },
      });

      return room;
    });

    return sendOk(toEntryDto({ roomId: createdRoom.id }));
  } catch (error) {
    console.error(error);
    return sendError("Failed to resolve entry", 500);
  }
}
