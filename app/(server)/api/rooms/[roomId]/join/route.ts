import {NextRequest} from "next/server";
import {requireUser} from "@/app/(server)/lib/auth/authService";
import serverApiResponse from "../../../serverApiResponse";
import {joinRoom} from "@/app/(server)/lib/room/roomService";
import {apiLogger} from "../../../api.utils";

export async function POST(
  _req: NextRequest,
  {params}: {params: Promise<{roomId: string}>}
) {
  const {roomId} = await params;
  const log = apiLogger("POST", `/api/rooms/${roomId}/join`);

  let userId: string;
  try {
    const {id} = await requireUser();
    userId = id;
  } catch (e) {
    log("error", "Login required", e);
    return serverApiResponse(401, "Login required", e);
  }

  try {
    const roomMember = await joinRoom({userId, roomId});

    log("info", "RoomMember joined");
    return serverApiResponse(200, "RoomMember joined", roomMember);
  } catch (e) {
    log("error", "Failed to join room", e);
    return serverApiResponse(500, "Failed to join room", e);
  }
}
