import { NextRequest } from "next/server";
import { requireUser } from "@/app/(server)/lib/auth/authService";
import serverApiResponse from "../../../serverApiResponse";
import { markMessagesReadInRoom } from "@/app/(server)/lib/room/roomService";
import { apiLogger } from "../../../api.utils";

// POST /api/rooms/[roomId]/read -> 방 아이디별 메시지 읽음 처리
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const log = apiLogger("POST", `/api/rooms/${roomId}/read`);

  let userId: string;
  try {
    const { id } = await requireUser();
    userId = id;
  } catch (e) {
    log("error", "Login required", e);
    return serverApiResponse(401, "Login required", e);
  }

  try {
    await markMessagesReadInRoom({ userId, roomId });

    log("info", "mark messages read");
    return serverApiResponse(200, "mark messages read", {});
  } catch (e) {
    log("error", "Failed to mark messages read", e);
    return serverApiResponse(500, "Failed to mark messages read", e);
  }
}
