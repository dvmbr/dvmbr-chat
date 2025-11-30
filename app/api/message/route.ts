import {NextRequest} from "next/server";
import {requireUser} from "@/lib/auth";
import {prisma} from "@/lib/db";
import {createMessage} from "@/lib/message";
import {apiCreated, apiError} from "@/lib/apiResponse";

// POST /api/messages -> 메시지 생성
// Body: { roomId: string, text: string }
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const body = await req.json().catch(() => null);
    const roomId = body?.roomId;
    const rawText = body?.text;

    if (!roomId || typeof roomId !== "string") {
      return apiError("Invalid roomId", 400);
    }
    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return apiError("Invalid text", 400);
    }

    const room = await prisma.room.findUnique({
      where: {id: roomId},
      select: {id: true},
    });
    if (!room) {
      return apiError("Room not found", 404);
    }

    const message = await createMessage({
      roomId,
      userId: user.id,
      text: rawText.trim(),
      createdAt: body?.createdAt,
    });

    return apiCreated("Message created", message);
  } catch (e) {
    console.error("POST /api/messages error:", e);
    return apiError("Failed to create message", 500);
  }
}
