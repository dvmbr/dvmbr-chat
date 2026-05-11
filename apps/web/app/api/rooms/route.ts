import prisma from "@/lib/server/db";
import {
  RoomCreateBodySchema,
  toRoomDTO,
  toRoomListDTO,
} from "@/lib/schemas/room.schema";
import {
  badRequest,
  conflict,
  internalServerError,
} from "@/lib/server/http/error-response";
import { getUserFromRequest } from "@/lib/server/auth/getUserFromRequest";
import { sendList, sendOk } from "@/lib/server/http/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const userId = user.id;

    const rooms = await prisma.room.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        creator: true,
      },
    });

    return sendList(toRoomListDTO(rooms));
  } catch (error) {
    return internalServerError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    const body = await req.json();

    const parsedBody = RoomCreateBodySchema.safeParse(body);

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

    const name = parsedBody.data.name.trim();

    const existingRoom = await prisma.room.findUnique({
      where: { name },
    });

    if (existingRoom) {
      return conflict({
        message: "Room name already exists",
      });
    }

    const userId = user.id;

    const room = await prisma.room.create({
      data: {
        name,
        creatorId: userId,
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
