import prisma from "@/lib/db";
import { EntryBodySchema, toEntryDTO } from "@/lib/schema/entry.schema";
import { badRequest, internalServerError } from "@/lib/utils/error-response";
import { sendOk } from "@/lib/utils/response";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("browserToken")?.value;

    /*
     * Returning flow:
     * If browserToken exists and matches a user, return the existing user.
     * If the token is missing or does not match any user, continue to the creation flow.
     */
    if (token) {
      const user = await prisma.user.findUnique({
        where: { browserToken: token },
      });

      if (user) {
        return sendOk(toEntryDTO({ user, isNew: false }));
      }
    }

    /*
     * Creation flow:
     * If the request body is missing or invalid, return 400.
     * The client should prompt the user to enter a nickname.
     */
    const body = await req.json().catch(() => null);
    const parsedBody = EntryBodySchema.safeParse(body);

    if (!parsedBody.success) {
      return badRequest({
        expected: "{ nickname: string }",
        details: "nickname must be at least 1 character",
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
    });

    const res = sendOk(toEntryDTO({ user, isNew: true }));
    res.cookies.set("browserToken", browserToken, {
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
