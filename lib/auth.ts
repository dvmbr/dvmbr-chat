import {cookies} from "next/headers";
import {prisma} from "@/lib/db";
import type {User} from "@prisma/client";

const SESSION_COOKIE = "chat_session";

type SessionPayload = {
  id: string;
  username: string;
};

// 현재 로그인한 유저를 DB에서 조회
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE)?.value;
    if (!raw) return null;

    const session = JSON.parse(raw) as SessionPayload;
    if (!session?.id) return null;

    // DB에서 실제 User 조회
    return await prisma.user.findUnique({
      where: {id: session.id},
    });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

// 세션 쿠키 생성
export async function createSession(params: {
  userId: string;
  username: string;
}) {
  const {userId, username} = params;

  try {
    const cookieStore = await cookies();

    const payload: SessionPayload = {
      id: userId,
      username,
    };

    cookieStore.set(SESSION_COOKIE, JSON.stringify(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // 로컬에서는 false, 프로덕션만 true
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("createSession error:", error);
    throw new Error("Failed to create session");
  }
}

// 로그인된 유저만 접근 허용, 없으면 에러 던짐
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
