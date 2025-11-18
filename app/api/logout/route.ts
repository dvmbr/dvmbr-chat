import {NextResponse} from "next/server";
import {cookies} from "next/headers";

const SESSION_COOKIE = "chat_session";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // 삭제
  });

  return NextResponse.json({success: true});
}
