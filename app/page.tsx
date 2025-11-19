import {cookies} from "next/headers";
import {redirect} from "next/navigation";
const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME!;

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);

  if (session) {
    // 로그인 되어 있다 -> 채팅방으로 이동
    redirect("/chat");
  }

  // 로그인 안 되어 있다 -> 로그인 페이지로 이동
  redirect("/login");
}
