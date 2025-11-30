import {NextRequest} from "next/server";
import {requireUser} from "@/lib/auth";
import {createRoom} from "@/lib/room";
import {apiCreated, apiError} from "@/lib/apiResponse";

// POST /api/rooms -> 방 생성
// Body: { name: string }
export async function POST(req: NextRequest) {
  try {
    await requireUser(); // 로그인 여부 검사

    const body = await req.json().catch(() => null);
    const rawName = body?.name;

    if (!rawName || typeof rawName !== "string") {
      return apiError("Invalid room name", 400);
    }

    const trimmed = rawName.trim();
    if (!trimmed) {
      return apiError("Room name cannot be empty", 400);
    }

    const room = await createRoom(trimmed);

    return apiCreated("Room created", room);
  } catch (e) {
    console.error("POST /api/rooms error:", e);
    return apiError("Failed to create room", 500);
  }
}
