import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/server/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId: roomIdStr } = await params;
  const roomId = parseInt(roomIdStr, 10);

  if (isNaN(roomId)) {
    return NextResponse.json({ error: "Invalid roomId" }, { status: 400 });
  }

  const body = await req.json();
  const { isAiMode } = body;

  if (typeof isAiMode !== "boolean") {
    return NextResponse.json({ error: "isAiMode must be boolean" }, { status: 400 });
  }

  await prisma.room.update({
    where: { id: roomId },
    data: { isAiMode },
  });

  return NextResponse.json({ success: true });
}
