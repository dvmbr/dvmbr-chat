import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {requireUser} from "@/lib/auth";

// POST /api/messages
// Body: { roomId: string; text: string }
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();

    const body = await req.json().catch(() => null);

    const roomId = body?.roomId;
    const text = body?.text;

    if (
      !roomId ||
      typeof roomId !== "string" ||
      !text ||
      typeof text !== "string" ||
      !text.trim()
    ) {
      return NextResponse.json({error: "Invalid payload"}, {status: 400});
    }

    const trimmedText = text.trim();

    const room = await prisma.room.findUnique({
      where: {id: roomId},
      select: {id: true},
    });

    if (!room) {
      return NextResponse.json({error: "Room not found"}, {status: 404});
    }

    const message = await prisma.message.create({
      data: {
        text: trimmedText,
        roomId,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        id: message.id,
        text: message.text,
        createdAt: message.createdAt,
        roomId: message.roomId,
        user: message.user,
      },
      {status: 201}
    );
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
