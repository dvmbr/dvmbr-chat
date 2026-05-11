import prisma from "@/lib/server/db";
import { RoomParamsSchema, toRoomReadDTO } from "@/lib/schemas/room.schema";
import {
  badRequest,
  internalServerError,
} from "@/lib/server/http/error-response";
import { getUserFromRequest } from "@/lib/server/auth/getUserFromRequest";
import { sendOk } from "@/lib/server/http/response";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/read">,
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

    const userId = user.id;
    const roomId = parsedParams.data.roomId;
    const result = await prisma.participant.updateMany({
      where: {
        userId,
        roomId,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return sendOk(toRoomReadDTO(result.count > 0));
  } catch (error) {
    return internalServerError(error);
  }
}
