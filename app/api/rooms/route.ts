import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  CreateRoomSchema,
  RoomQuerySchema,
  toRoomDto,
} from "@/lib/schema/room.schema";
import { sendError, sendList, sendOk } from "@/lib/utils/response";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = RoomQuerySchema.safeParse({
      id: searchParams.get("id") ?? undefined,
      name: searchParams.get("name") ?? undefined,
    });

    if (!parsed.success) {
      return sendError(
        "Invalid query parameters: { id:number, name:string }",
        400,
      );
    }

    if (parsed.data.id !== undefined) {
      const room = await prisma.room.findUnique({
        where: { id: parsed.data.id },
      });

      return !room ? sendError("Room not found", 404) : sendOk(toRoomDto(room));
    }

    if (parsed.data.name !== undefined) {
      const rooms = await prisma.room.findMany({
        where: {
          name: {
            contains: parsed.data.name,
            mode: "insensitive" as const,
          },
        },
      });
      return sendList(rooms.map(toRoomDto));
    }

    const rooms = await prisma.room.findMany();
    return sendList(rooms.map(toRoomDto));
  } catch (error: unknown) {
    return sendError(error, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateRoomSchema.safeParse(body);

    if (!parsed.success) {
      return sendError("Invalid request body: { name:string }", 400);
    }

    const room = await prisma.room.create({
      data: {
        name: parsed.data.name,
        creatorId: parsed.data.creatorId,
        participants: {
          create: { userId: parsed.data.creatorId },
        },
      },
    });

    return sendOk(
      toRoomDto(room),
      201,
      `Room created: ${room.id}: ${room.name}`,
    );
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return sendError("Room name already exists", 409);
    }
    return sendError(error, 500);
  }
}
