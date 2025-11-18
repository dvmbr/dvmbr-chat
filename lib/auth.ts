import {cookies} from "next/headers";
import {prisma} from "@/lib/db";

const SESSION_COOKIE = "chat_session";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE)?.value;
    if (!session) return null;

    return await prisma.user.findUnique({where: {id: session}});
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

export async function createSession(userId: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, userId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("createSession error:", error);
    throw new Error("Failed to create session");
  }
}
