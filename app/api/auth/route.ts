import {NextRequest, NextResponse} from "next/server";
import {createSession} from "@/lib/auth";
import {getUserByName, createUserByName} from "@/lib/user";

// POST /api/auth
// Body: { name: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    // 프론트에서 { name: "닉네임" } 형태로 보내는 것을 기준으로 함
    const rawName = body?.name;

    if (!rawName || typeof rawName !== "string") {
      return NextResponse.json({error: "Invalid name"}, {status: 400});
    }

    const trimmed = rawName.trim();
    if (!trimmed) {
      return NextResponse.json({error: "name cannot be empty"}, {status: 400});
    }

    // 1) 이름으로 유저 조회
    let user = await getUserByName(trimmed);

    // 2) 없으면 새로 생성
    if (!user) {
      user = await createUserByName(trimmed);
    }

    // 3) 세션 쿠키 설정
    await createSession({id: user.id, name: user.name});

    // 4) 응답
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
      },
      {status: 200}
    );
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
