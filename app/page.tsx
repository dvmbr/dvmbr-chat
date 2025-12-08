import {redirect} from "next/navigation";
import {getCurrentUser} from "./(server)/lib/auth/authService";

export default async function HomePage() {
  const sessionUser = await getCurrentUser();

  if (sessionUser) {
    // 로그인 되어 있다 -> 채팅방으로 이동
    redirect("/chat");
  }

  // 로그인 안 되어 있다 -> 로그인 페이지로 이동
  redirect("/login");
}
