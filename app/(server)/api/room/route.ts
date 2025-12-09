import {NextRequest} from "next/server";
import {requireUser} from "../../lib/auth/authService";
import {createRoom} from "../../lib/room/roomService";
import {apiLogger} from "../api.utils";
import serverApiResponse from "../serverApiResponse";
import {RoomDTO} from "../../lib/room/roomDTO";

export type CreateRoomPayload = {
  roomName: string;
};

// POST /api/room -> 방 생성
export async function POST(req: NextRequest) {
  const log = apiLogger("POST", "/api/room");

  // 1) 인증 체크
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    log("error", "Login required", e);
    return serverApiResponse(401, "Login required", e);
  }

  // 2) body 파싱
  let body: CreateRoomPayload;
  try {
    body = await req.json();
  } catch (e) {
    log("error", "Invalid JSON body", e);
    return serverApiResponse(400, "Invalid JSON body", {});
  }

  // 3) 방 이름 검증 + 방 생성
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

    const room: RoomDTO = await createRoom({
      hostId: user.id,
      roomName: trimmed,
    });

    log("info", `Room created by user ${user.id}`);
    return serverApiResponse(201, "Room created", room);
  } catch (e) {
    log("error", "Failed to create room", e);
    return serverApiResponse(500, "Failed to create room", e);
  }
}
