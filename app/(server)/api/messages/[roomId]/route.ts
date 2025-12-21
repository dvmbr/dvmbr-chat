import { requireUser } from "@/app/(server)/lib/auth/authService";
import { getMessagesByRoomId } from "@/app/(server)/lib/message/messageService";
import { NextRequest } from "next/server";
import { apiLogger } from "../../api.utils";
import serverApiResponse from "../../serverApiResponse";

// GET /api/messages/[roomId] -> 방 별로 전체 메시지 불러오기
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const log = apiLogger("GET", `/api/messages/${roomId}`);

  try {
    await requireUser();
  } catch (e) {
    log("error", "Login required", e);
    return serverApiResponse(401, "Login required", e);
  }

  try {
    const messages = await getMessagesByRoomId(roomId);

    log("info", "messages fetched");
    return serverApiResponse(200, "messages fetched", messages);
  } catch (e) {
    log("error", "Failed to fetch messages", e);
    return serverApiResponse(500, "Failed to fetch messages", e);
  }
}
