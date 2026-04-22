import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  RoomParamSchema,
  toRoomDto,
  UpdateRoomSchema,
} from "@/lib/schema/room.schema";
import { sendOk } from "@/lib/utils/response";
import { badRequest, notFound, serverError } from "@/lib/utils/error-response";

export async function GET(
  _req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]">,
) {
  try {
    const parsedParams = RoomParamSchema.safeParse(await params);

    if (!parsedParams.success) {
      return badRequest("Invalid route parameter", {
        expected: "{ roomId:number }",
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: parsedParams.data.roomId },
    });

    if (!room) {
      return notFound("Room");
    }

    return sendOk(toRoomDto(room));
  } catch {
    return serverError();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]">,
) {
  try {
    const parsedParams = RoomParamSchema.safeParse(await params);

    if (!parsedParams.success) {
      return badRequest("Invalid route parameter", {
        expected: "{ roomId:number }",
      });
    }

    const body = await req.json();
    const parsed = UpdateRoomSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Invalid request body", {
        expected: "{ name:string }",
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: parsedParams.data.roomId },
    });

    if (!room) {
      return notFound("Room");
    }

    const updatedRoom = await prisma.room.update({
      where: { id: parsedParams.data.roomId },
      data: {
        name: parsed.data.name,
      },
    });

    return sendOk(toRoomDto(updatedRoom));
  } catch {
    return serverError();
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]">,
) {
  try {
    const parsedParams = RoomParamSchema.safeParse(await params);

    if (!parsedParams.success) {
      return badRequest("Invalid route parameter", {
        expected: "{ roomId: number }",
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: parsedParams.data.roomId },
      include: {
        participants: {
          select: { id: true },
        },
      },
    });

    if (!room) {
      return notFound("Room");
    }

    const participantIds = room.participants.map(
      (participant) => participant.id,
    );

    await prisma.$transaction(async (tx) => {
      if (participantIds.length > 0) {
        await tx.message.deleteMany({
          where: {
            participantId: {
              in: participantIds,
            },
          },
        });

        await tx.participant.deleteMany({
          where: {
            roomId: parsedParams.data.roomId,
          },
        });
      }

      await tx.room.delete({
        where: { id: parsedParams.data.roomId },
      });
    });

    return sendOk(null, 200, "Room deleted");
  } catch {
    return serverError();
  }
}
