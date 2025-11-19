import {NextRequest, NextResponse} from "next/server";
import {requireUser} from "@/lib/auth";
import {prisma} from "@/lib/db";
import {createMessage} from "@/lib/message";

// POST /api/messages -> 메시지 생성
// Body: { roomId: string, text: string }
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const body = await req.json().catch(() => null);
    const roomId = body?.roomId;
    const rawText = body?.text;

    if (!roomId || typeof roomId !== "string") {
      return NextResponse.json({error: "Invalid roomId"}, {status: 400});
    }
    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return NextResponse.json({error: "Invalid text"}, {status: 400});
    }

    const room = await prisma.room.findUnique({
      where: {id: roomId},
      select: {id: true},
    });
    if (!room) {
      return NextResponse.json({error: "Room not found"}, {status: 404});
    }

    const message = await createMessage({
      roomId,
      userId: user.id,
      text: rawText.trim(),
      createdAt: body?.createdAt,
    });

    return NextResponse.json(message, {status: 201});
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
