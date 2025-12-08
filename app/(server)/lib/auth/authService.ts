import type {User} from "@prisma/client";
import {getUserById} from "../user/userService";
import {
  readSession,
  writeSession,
  clearSessionCookie,
  type SessionPayload,
} from "./sessionStore";

// 현재 로그인한 유저 조회 (없으면 null)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await readSession();
    if (!session?.id) return null;

    const user = await getUserById(session.id);
    return user;
  } catch {
    return null;
  }
}

type CreateSessionParams = SessionPayload;

// 세션 쿠키 생성
export async function createSession({id, name}: CreateSessionParams) {
  await writeSession({id, name});
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
  await clearSessionCookie();
}
