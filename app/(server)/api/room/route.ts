import {Room} from "@prisma/client";
import {NextRequest} from "next/server";
import {requireUser} from "../../lib/auth/authService";
import {createRoom} from "../../lib/room/roomService";
import {apiLogger} from "../api.utils";
import serverApiResponse from "../serverApiResponse";

// Body: { name: string }
export type CreateRoomPayload = {
  roomName: string;
};

// POST /api/room -> 방 생성
export async function POST(req: NextRequest) {
  const log = apiLogger("POST", "/api/room");

  try {
    await requireUser();
  } catch (e) {
    log("error", "Login required", e);
    return serverApiResponse(401, "Login required", e);
  }

  let body: CreateRoomPayload;

  try {
    body = await req.json();
  } catch (e) {
    log("error", "Invalid JSON body", e);
    return serverApiResponse(400, "Invalid JSON body", {});
  }

  try {
    if (!body.roomName) {
      log("error", "Invalid room name");
      return serverApiResponse(400, "Invalid room name", {});
    }

    const trimmed = body.roomName.trim();
    if (!trimmed) {
      log("error", "Room name cannot be empty");
      return serverApiResponse(400, "Room name cannot be empty", {});
    }

    const room: Room = await createRoom(trimmed);

    log("info", "Room created");
    return serverApiResponse(201, "Room created", room);
  } catch (e) {
    log("error", "Failed to create room", e);
    return serverApiResponse(500, "Failed to create room", e);
  }
}
