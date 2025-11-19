import {cookies} from "next/headers";
import type {User} from "@prisma/client";
import {getUserById} from "./user";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME!;

type SessionPayload = {
  id: string;
  username: string;
};

// 현재 로그인한 유저 조회 (없으면 null)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE)?.value;
    if (!raw) return null;

    const session = JSON.parse(raw) as SessionPayload;
    if (!session?.id) return null;

    // 여기서는 prisma 직접 호출 X -> lib/user.ts의 getUserById 사용
    const user = await getUserById(session.id);
    return user;
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
      secure: process.env.NODE_ENV === "production", // 로컬 -> false, 프로덕션 -> true
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("createSession error:", error);
    throw new Error("Failed to create session");
  }
}

// 로그인 필수인 곳에서 사용하는 헬퍼
// 유저가 없으면 에러 던지고, 있으면 User 반환
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

// 세션 제거
export async function clearSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
  } catch (error) {
    console.error("clearSession error:", error);
    throw new Error("Failed to clear session");
  }
}
