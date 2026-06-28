import { COOKIE_KEY } from "@/lib/constants/cookie-constants";
import prisma from "@/lib/server/db";
import { getUserFromRequest } from "@/lib/server/auth/getUserFromRequest";
import {
  badRequest,
  internalServerError,
} from "@/lib/server/http/error-response";
import { sendOk } from "@/lib/server/http/response";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    const nickname = body.nickname?.trim();

    if (!nickname) {
      return badRequest({ message: "nickname is required" });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { nickname },
      select: { id: true, nickname: true },
    });

    return sendOk(updated);
  } catch (error) {
    if (error instanceof Response) return error;
    return internalServerError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);

    await prisma.user.delete({ where: { id: user.id } });

    const res = NextResponse.json({ success: true });
    res.cookies.delete(COOKIE_KEY);
    return res;
  } catch (error) {
    if (error instanceof Response) return error;
    return internalServerError(error);
  }
}
