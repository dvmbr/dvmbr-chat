import prisma from "@/lib/db";
import {
  RoomParamsSchema,
  RoomUpdateBodySchema,
  toRoomDTO,
} from "@/lib/schema/room.schema";
import {
  badRequest,
  forbidden,
  internalServerError,
  notFound,
} from "@/lib/utils/error-response";
import { getUserFromRequest } from "@/lib/utils/getUserFromRequest";
import { sendOk } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]">,
) {
  try {
    const user = await getUserFromRequest(req);

    const p = await params;
    const parsedParams = RoomParamsSchema.safeParse(p);

    if (!parsedParams.success) {
      return badRequest({
        message: "roomId must be a positive integer",
      });
    }

    const body = await req.json();
    const parsedBody = RoomUpdateBodySchema.safeParse(body);

    if (!parsedBody.success) {
      return badRequest({
        message: "Invalid request body",
      });
    }

    if (!parsedBody.data.name || parsedBody.data.name.trim() === "") {
      return badRequest({
        message: "room name must be a non-empty string",
      });
    }

    const roomId = parsedParams.data.roomId;

    const existingRoom = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!existingRoom) {
      return notFound({
        message: "Room not found",
      });
    }

    if (existingRoom.creatorId !== user.id) {
      return forbidden({
        message: "Only the creator of the room can update it",
      });
    }

    const name = parsedBody.data.name.trim();

    const room = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        name,
      },

      include: {
        creator: true,
      },
    });

    return sendOk(toRoomDTO(room));
  } catch (error) {
    return internalServerError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]">,
) {
  try {
    const user = await getUserFromRequest(req);

    const p = await params;
    const parsedParams = RoomParamsSchema.safeParse(p);

    if (!parsedParams.success) {
      return badRequest({
        message: "roomId must be a positive integer",
      });
    }

    const roomId = parsedParams.data.roomId;

    const existingRoom = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!existingRoom) {
      return notFound({
        message: "Room not found",
      });
    }

    if (existingRoom.creatorId !== user.id) {
      return forbidden({
        message: "Only the creator of the room can delete it",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.participant.deleteMany({
        where: { roomId },
      });

      await tx.room.delete({
        where: { id: roomId },
      });
    });

    return sendOk({
      message: "Room deleted successfully",
    });
  } catch (error) {
    return internalServerError(error);
  }
}
