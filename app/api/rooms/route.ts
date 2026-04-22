import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { CreateRoomSchema, toRoomDto } from "@/lib/schema/room.schema";
import { sendList, sendOk } from "@/lib/utils/response";
import {
  badRequest,
  unauthorized,
  notFound,
  serverError,
} from "@/lib/utils/error-response";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    return sendList(rooms.map(toRoomDto));
  } catch {
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsedBody = CreateRoomSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return badRequest("Invalid request body", {
        expected: "{ name: string }",
      });
    }

    const userIdValue = req.cookies.get("userId")?.value;

    if (!userIdValue) {
      return unauthorized();
    }

    const userId = Number(userIdValue);

    if (!Number.isInteger(userId) || userId <= 0) {
      return unauthorized({
        reason: "Invalid userId cookie",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return notFound("User", {
        expected: "{ userId: number }",
      });
    }

    const room = await prisma.room.create({
      data: {
        name: parsedBody.data.name,
        creatorId: user.id,
        participants: {
          create: {
            userId: user.id,
          },
        },
      },
    });

    return sendOk(toRoomDto(room), 201, "Room created");
  } catch {
    return serverError();
  }
}
