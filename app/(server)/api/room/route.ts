import {requireUser} from "@/app/(server)/lib/auth";
import {apiLogger} from "@/app/(server)/utils/apiLogger";
import {NextRequest} from "next/server";
import serverApiResponse from "../serverApiResponse";
import {createRoom} from "@/app/(server)/lib/room";
import {Room} from "@prisma/client";

// POST /api/rooms -> 방 생성
// Body: { name: string }
export type CreateRoomRequestBody = {
  roomName: string;
};
export async function POST(req: NextRequest) {
  const log = apiLogger("POST", "/api/rooms");

  let body: CreateRoomRequestBody;

  try {
    await requireUser(); // 로그인 여부 검사

    try {
      body = await req.json();
    } catch (e) {
      log("error", "Invalid JSON body", e);
      return serverApiResponse(400, "Invalid JSON body");
    }

    if (!body.roomName) {
      log("error", "Invalid room name");
      return serverApiResponse(400, "Invalid room name");
    }

    const trimmed = body.roomName.trim();
    if (!trimmed) {
      log("error", "Room name cannot be empty");
      return serverApiResponse(400, "Room name cannot be empty");
    }

    const room: Room = await createRoom(trimmed);

    log("info", "Room created");
    return serverApiResponse(201, "Room created", room);
  } catch (e) {
    log("error", "Failed to create room", e);
    return serverApiResponse(500, "Failed to create room", e);
  }
}
