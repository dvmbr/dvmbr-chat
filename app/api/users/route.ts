import { NextRequest } from "next/server";
import prisma from "@/lib/db";

import { sendList, sendOk } from "@/lib/utils/response";
import { badRequest, serverError } from "@/lib/utils/error-response";

import { CreateUserSchema, toUserDto } from "@/lib/schema/user.schema";

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return sendList(users.map(toUserDto));
  } catch {
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsedBody = CreateUserSchema.safeParse(await req.json());

    if (!parsedBody.success) {
      return badRequest("Invalid request body", {
        expected: "{ nickname: string }",
      });
    }

    let user = await prisma.user.findUnique({
      where: { nickname: parsedBody.data.nickname },
    });

    const isNewUser = !user;

    if (!user) {
      user = await prisma.user.create({
        data: { nickname: parsedBody.data.nickname },
      });
    }

    const response = sendOk(
      toUserDto(user),
      isNewUser ? 201 : 200,
      isNewUser
        ? `User created: ${user.id}: ${user.nickname}`
        : `User retrieved: ${user.id}: ${user.nickname}`,
    );

    response.cookies.set("userId", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return serverError();
  }
}
