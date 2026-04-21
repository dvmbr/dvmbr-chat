import prisma from "@/lib/db";
import { toRoomDto } from "@/lib/schema/room.schema";
import { sendError, sendOk } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const roomId = await params.then((p) => parseInt(p.roomId, 10));

    if (Number.isNaN(roomId)) {
      return sendError("Invalid roomId", 400);
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return sendError("Room not found", 404);
    }

    return sendOk(toRoomDto(room));
  } catch (error: unknown) {
    return sendError(error, 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const roomId = await params.then((p) => parseInt(p.roomId, 10));

    if (Number.isNaN(roomId)) {
      return sendError("Invalid roomId", 400);
    }

    await prisma.room.delete({
      where: { id: roomId },
    });

    // const room = await prisma.room.findUnique({
    //   where: { id: roomId },

    //   include: {
    //     participants: {
    //       select: { id: true },
    //     },
    //   },
    // });

    // if (!room) {
    //   return sendError("Room not found", 404);
    // }

    // const participantIds = room.participants.map(
    //   (participant) => participant.id,
    // );

    // await prisma.$transaction(async (tx) => {
    //   if (participantIds.length > 0) {
    //     await tx.message.deleteMany({
    //       where: {
    //         participantId: {
    //           in: participantIds,
    //         },
    //       },
    //     });

    //     await tx.participant.deleteMany({
    //       where: {
    //         roomId: roomId,
    //       },
    //     });
    //   }

    //   await tx.room.delete({
    //     where: { id: roomId },
    //   });
    // });

    return sendOk(null, 204, "Room deleted");
  } catch (error: unknown) {
    return sendError(error, 500);
  }
}
