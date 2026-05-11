import { COOKIE_KEY } from "@/lib/constants/cookie-constants";
import { cookies } from "next/headers";
import prisma from "@/lib/server/db";
import AppEntry from "@/components/client/AppEntry";
import { toUserDTO } from "@/lib/mappers/user.mapper";

/**
 * Check user existence by checking the browser token in cookies and querying the database.
 * Render children whether the user exists or not and even error occurs. The only responsibility of this component is to determine the initial state of the client-side entry.
 */

export default async function AppGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_KEY)?.value;

  const result = token
    ? await prisma.user.findUnique({
        where: { browserToken: token },
      })
    : null;

  const user = result ? toUserDTO(result) : null;

  return <AppEntry user={user}>{children}</AppEntry>;
}
