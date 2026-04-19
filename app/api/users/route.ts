import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { sendOk, sendList, sendError } from "@/lib/utils/response";
import {
  UserQuerySchema,
  CreateUserSchema,
  UpdateUserSchema,
  DeleteUserSchema,
  toUserDto,
} from "@/lib/schema/user.schema";

// GET /api/users?id=1
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = UserQuerySchema.safeParse({
      id: searchParams.get("id") ?? undefined,
      nickname: searchParams.get("nickname") ?? undefined,
    });

    if (!parsed.success) {
      return sendError(
        "Invalid query parameters: { id:number, nickname:string }",
        400,
      );
    }

    if (parsed.data.id !== undefined) {
      const user = await prisma.user.findUnique({
        where: { id: parsed.data.id },
      });

      return !user ? sendError("User not found", 404) : sendOk(toUserDto(user));
    }

    if (parsed.data.nickname !== undefined) {
      const users = await prisma.user.findMany({
        where: {
          nickname: {
            contains: parsed.data.nickname,
            mode: "insensitive" as const,
          },
        },
      });
      return sendList(users.map(toUserDto));
    }

    const users = await prisma.user.findMany();
    return sendList(users.map(toUserDto));
  } catch (error: unknown) {
    return sendError(error, 500);
  }
}

// POST /api/users
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateUserSchema.parse(body);
    const user = await prisma.user.create({
      data: { nickname: parsed.nickname },
    });
    return sendOk(
      toUserDto(user),
      201,
      `User created: ${user.id}: ${user.nickname}`,
    );
  } catch (error: unknown) {
    return sendError(error, 400);
  }
}

// PUT /api/users
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = UpdateUserSchema.parse(body);
    const user = await prisma.user.update({
      where: { id: parsed.id },
      data: { nickname: parsed.nickname },
    });
    return sendOk(toUserDto(user), 200, `User updated: ${parsed.id}`);
  } catch (error: unknown) {
    return sendError(error, 400);
  }
}

// DELETE /api/users
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = DeleteUserSchema.parse(body);
    await prisma.user.delete({ where: { id: parsed.id } });
    return sendOk(null, 200, `User deleted: ${parsed.id}`);
  } catch (error: unknown) {
    return sendError(error, 400);
  }
}
