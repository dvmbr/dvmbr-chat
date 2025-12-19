import { NextRequest } from "next/server";
import { requireUser } from "../../lib/auth/authService";
import { createMessage } from "../../lib/message/messageService";
import { getRoomByRoomId } from "../../lib/room/roomService";
import { apiLogger } from "../api.utils";
import serverApiResponse from "../serverApiResponse";

export type CreateMessagePayload = {
  cuid: string;
  roomId: string;
  text: string;
  createdAt: Date;
};

// POST /api/message -> 메시지 생성
// Body: { roomId: string, text: string }
export async function POST(req: NextRequest) {
  const log = apiLogger("POST", "/api/message");

  let userId: string;
  try {
    const { id } = await requireUser();
    userId = id;
  } catch (e) {
    log("error", "Login required", e);
    return serverApiResponse(401, "Login required", e);
  }

  let body: CreateMessagePayload;

  try {
    body = await req.json();
  } catch (e) {
    log("error", "Invalid JSON body", e);
    return serverApiResponse(400, "Invalid JSON body", {});
  }

  try {
    const { cuid, roomId, text, createdAt } = body;

    if (!roomId) {
      log("error", "Invalid roomId");
      return serverApiResponse(400, "Invalid roomId", {});
    }
    if (!text.trim()) {
      log("error", "Invalid text");
      return serverApiResponse(400, "Invalid text", {});
    }

    const room = await getRoomByRoomId(roomId);
    if (!room) {
      log("error", "Room not found");
      return serverApiResponse(404, "Room not found", {});
    }

    const message = await createMessage({
      cuid,
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
