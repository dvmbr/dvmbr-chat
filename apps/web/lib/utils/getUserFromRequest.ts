import prisma from "@/lib/db";
import { COOKIE_KEY } from "@/lib/constants/cookie-constants";
import { NextRequest } from "next/server";
import { notFound, unauthorized } from "@/lib/utils/error-response";

export async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get(COOKIE_KEY)?.value;

  if (!token) {
    throw unauthorized({
      message: "Missing browserToken cookie",
    });
  }

  const user = await prisma.user.findUnique({
    where: { browserToken: token },
  });

  if (!user) {
    throw notFound({
      message: "User not found for the provided browserToken",
    });
  }

  return user;
}
