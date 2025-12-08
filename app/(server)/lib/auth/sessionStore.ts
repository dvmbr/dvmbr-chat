import {cookies} from "next/headers";

export type SessionPayload = {
  id: string;
  name: string;
};

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME!;

// 세션 쿠키 읽기 (없으면 null)
export async function readSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_COOKIE)?.value;
    if (!raw) return null;

    const session = JSON.parse(raw) as SessionPayload;
    if (!session?.id) return null;

    return session;
  } catch {
    return null;
  }
}

// 세션 쿠키 쓰기
export async function writeSession(payload: SessionPayload): Promise<void> {
  try {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, JSON.stringify(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  } catch {
    throw new Error("Failed to create session");
  }
}

// 세션 쿠키 삭제
export async function clearSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
  } catch {
    throw new Error("Failed to clear session");
  }
}
