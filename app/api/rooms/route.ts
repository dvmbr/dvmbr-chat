import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {requireUser} from "@/lib/auth";

// GET /api/rooms  : 방 목록 조회
export async function GET() {
  try {
    await requireUser();

    const rooms = await prisma.room.findMany({
      orderBy: {createdAt: "desc"},
    });

    return NextResponse.json(
      rooms.map((room) => ({
        id: room.id,
        name: room.name,
        createdAt: room.createdAt,
      })),
      {status: 200}
    );
  } catch (error) {
    console.error("GET /api/rooms error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

// POST /api/rooms : 방 생성
export async function POST(req: NextRequest) {
  try {
    await requireUser();

    const body = await req.json().catch(() => null);
    const name = body?.name;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({error: "Invalid room name"}, {status: 400});
    }

    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        // 필요하다면 ownerId 같은 필드도 여기서 user.id로 저장
      },
    });

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
