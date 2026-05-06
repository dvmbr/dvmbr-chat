import prisma from "@/lib/db";
import { socketClient } from "@/lib/http-clients";
import {
  MessageCreateBodySchema,
  MessageParamsSchema,
  toMessageDTO,
  toMessageListDTO,
} from "@/lib/schema/message.schema";
import {
  badRequest,
  internalServerError,
  unauthorized,
} from "@/lib/utils/error-response";
import { getUserFromRequest } from "@/lib/utils/getUserFromRequest";
import { sendList, sendOk } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/messages">,
) {
  try {
    const user = await getUserFromRequest(req);

    const p = await params;
    const parsedParams = MessageParamsSchema.safeParse({
      roomId: p.roomId,
    });

    if (!parsedParams.success) {
      return badRequest({
        message: "roomId must be a positive integer",
      });
    }

    const userId = user.id;
    const roomId = parsedParams.data.roomId;
    const participant = await prisma.participant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (!participant) {
      return unauthorized({
        message: "Not a participant",
      });
    }

    const messages = await prisma.message.findMany({
      where: { roomId },
      include: {
        participant: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return sendList(toMessageListDTO(messages));
  } catch (error) {
    return internalServerError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: RouteContext<"/api/rooms/[roomId]/messages">,
) {
  try {
    const user = await getUserFromRequest(req);

    const p = await params;
    const parsedParams = MessageParamsSchema.safeParse({
      roomId: p.roomId,
    });
    if (!parsedParams.success) {
      return badRequest({
        message: "roomId as a positive integer in the URL path",
      });
    }

    const userId = user.id;
    const roomId = parsedParams.data.roomId;
    const participant = await prisma.participant.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (!participant) {
      return unauthorized({ message: "Not a participant" });
    }

    const participantId = participant.id;

    const body = await req.json();
    const parsedBody = MessageCreateBodySchema.safeParse(body);
    if (!parsedBody.success) {
      return badRequest({
        message:
          "content and type are required in the request body must be a non-empty string and a valid MessageType respectively",
      });
    }

    const message = await prisma.$transaction(async (tx) => {
      const createdMessage = await tx.message.create({
        data: {
          participantId,
          roomId,
          content: parsedBody.data.content,
          type: parsedBody.data.type,
        },
        include: {
          participant: {
            include: {
              user: {
                select: {
                  id: true,
                  nickname: true,
                },
              },
            },
          },
        },
      });

      await tx.room.update({
        where: { id: roomId },
        data: { updatedAt: new Date() },
      });

      return createdMessage;
    });

    // TODO(socket): Emit unreadCount update to room participants
    const participants = await prisma.participant.findMany({
      where: {
        roomId,
        userId: {
          not: userId,
        },
      },

      select: {
        userId: true,
        lastReadAt: true,
      },
    });

    const unreadCountPayloads = await Promise.all(
      participants.map(async (participant) => {
        const unreadCount = await prisma.message.count({
          where: {
            roomId,
            createdAt: {
              gt: participant.lastReadAt ?? new Date(0),
            },

            participant: {
              userId: {
                not: participant.userId,
              },
            },
          },
        });

        return {
          userId: participant.userId,
          roomId,
          unreadCount,
        };
      }),
    );

    // TODO(socket): Send unreadCountPayloads to socket server

    return sendOk(toMessageDTO(message));
  } catch (error) {
    return internalServerError(error);
  }
}
