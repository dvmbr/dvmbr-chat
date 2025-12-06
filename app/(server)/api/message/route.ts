import {requireUser} from "@/app/(server)/lib/auth";
import {apiLogger} from "@/app/(server)/utils/apiLogger";
import {NextRequest} from "next/server";
import serverApiResponse from "../serverApiResponse";
import {prisma} from "@/app/(server)/lib/db";
import {createMessage} from "@/app/(server)/lib/message";

export type CreateMessageRequestBody = {
  roomId: string;
  text: string;
  createdAt: Date;
};

// POST /api/messages -> 메시지 생성
// Body: { roomId: string, text: string }
export async function POST(req: NextRequest) {
  const log = apiLogger("POST", "/api/rooms");

  let body: CreateMessageRequestBody;

  try {
    body = await req.json();
  } catch (e) {
    log("error", "Invalid JSON body", e);
    return serverApiResponse(400, "Invalid JSON body");
  }

  try {
    const {id: userId} = await requireUser();

    const {roomId, text, createdAt} = body;

    if (!roomId) {
      log("error", "Invalid roomId");
      return serverApiResponse(400, "Invalid roomId");
    }
    if (!text.trim()) {
      log("error", "Invalid text");
      return serverApiResponse(400, "Invalid text");
    }

    const room = await prisma.room.findUnique({
      where: {id: roomId},
      select: {id: true},
    });
    if (!room) {
      log("error", "Room not found");
      return serverApiResponse(404, "Room not found");
    }

    const message = await createMessage({
      roomId,
      userId,
      text,
      createdAt,
    });

    log("info", "Message created");
    return serverApiResponse(201, "Message created", message);
  } catch (e) {
    log("error", "Failed to create message", e);
    return serverApiResponse(500, "Failed to create message", e);
  }
}
