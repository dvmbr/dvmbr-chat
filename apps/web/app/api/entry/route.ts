import { COOKIE_KEY } from "@/lib/constants/cookie-constants";
import { toEntryDTO } from "@/lib/mappers/entry.mapper";
import { userDTOSelect } from "@/lib/mappers/user.mapper";
import { EntryBodySchema } from "@/lib/schemas/entry/request";
import prisma from "@/lib/server/db";
import {
  badRequest,
  internalServerError,
} from "@/lib/server/http/error-response";
import { sendOk } from "@/lib/server/http/response";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    /*
     * Creation flow:
     * If the request body is missing or invalid, return 400.
     * The client should prompt the user to enter a nickname.
     */
    const body = await req.json().catch(() => null);
    const parsedBody = EntryBodySchema.safeParse(body);

    if (!parsedBody.success) {
      return badRequest({
        message:
          "nickname is required in the request body and must be a non-empty string",
      });
    }

    const nickname = parsedBody.data.nickname.trim();
    const browserToken = randomUUID();

    /**
     * if nickname is duplicated, Prisma throws P2002.
     * toErrorResponse() maps P2002 to 409 Conflict.
     * The client should ask the user to choose another nickname.
     */
    const user = await prisma.user.create({
      data: {
        nickname,
        browserToken,
      },
      select: userDTOSelect,
    });

    const res = sendOk(toEntryDTO({ user }));
    res.cookies.set(COOKIE_KEY, browserToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error in /entry route:", error);
    return internalServerError(error);
  }
}
