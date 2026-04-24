import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { RoomCreateBodySchema, toRoomDTO } from "@/lib/schema/room.schema";
import { sendList, sendOk } from "@/lib/utils/response";
import { badRequest, notFound, serverError } from "@/lib/utils/error-response";
import { EnterCookieSchema } from "@/lib/schema/entry.schema";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany();
    return sendList(rooms.map(toRoomDTO));
  } catch {
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieParsed = EnterCookieSchema.safeParse({
      userId: req.cookies.get("userId")?.value,
    });

    if (!cookieParsed.success || !cookieParsed.data.userId) {
      return badRequest("User cookie not found", {
        expected: "{ userId: number }",
      });
    }

    const userId = cookieParsed.data.userId;

    const parsedBody = RoomCreateBodySchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return badRequest("Invalid request body", {
        expected: "{ name: string }",
      });
    }

    const room = await prisma.room.create({
      data: {
        name: parsedBody.data.name,
        creatorId: userId,
        participants: {
          create: {
            userId: userId,
          },
        },
      },
    });

    return sendOk(toRoomDTO(room), 201, "Room created");
  } catch {
    return serverError();
  }
}
