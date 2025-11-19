import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME!;

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = req.cookies.get(SESSION_COOKIE)?.value;

  // (1) 로그인 페이지 접근 -> 이미 로그인 상태라면 막기
  if (pathname === "/login" && session) {
    const chatUrl = new URL("/chat", req.url);
    return NextResponse.redirect(chatUrl);
  }

  // (2) 보호된 경로 -> 세션 없으면 차단
  if (pathname.startsWith("/chat") && !session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 4) 보호할 경로 지정 (matcher 필요)
export const config = {
  matcher: [
    "/chat/:path*", // /chat, /chat/[roomId] 모두 보호
  ],
};
