import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db";
import {createSession} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = body?.username;

    if (!username || typeof username !== "string") {
      return NextResponse.json({error: "Invalid username"}, {status: 400});
    }

    const trimmed = username.trim();
    if (!trimmed) {
      return NextResponse.json(
        {error: "Username cannot be empty"},
        {status: 400}
      );
    }

    // 유저 조회 또는 생성
    let user = await prisma.user.findUnique({
      where: {username: trimmed},
    });

    if (!user) {
      user = await prisma.user.create({
        data: {username: trimmed},
      });
    }

    // 세션 쿠키 설정
    await createSession({userId: user.id, username: user.username});

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
      },
      {status: 200}
    );
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
