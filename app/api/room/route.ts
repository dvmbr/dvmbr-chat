import {NextRequest, NextResponse} from "next/server";
import {requireUser} from "@/lib/auth";
import {createRoom} from "@/lib/room";

// POST /api/rooms -> 방 생성
// Body: { name: string }
export async function POST(req: NextRequest) {
  try {
    await requireUser(); // 로그인 여부 검사

    const body = await req.json().catch(() => null);
    const rawName = body?.name;

    if (!rawName || typeof rawName !== "string") {
      return NextResponse.json({error: "Invalid room name"}, {status: 400});
    }

    const trimmed = rawName.trim();
    if (!trimmed) {
      return NextResponse.json(
        {error: "Room name cannot be empty"},
        {status: 400}
      );
    }

    const room = await createRoom(trimmed);

    return NextResponse.json(
      {
        id: room.id,
        name: room.name,
        createdAt: room.createdAt,
      },
      {status: 201}
    );
  } catch (error) {
    console.error("POST /api/rooms error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
