/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users or a specific user by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: false
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: The nickname of the user
 *             required:
 *               - nickname
 *     responses:
 *       201:
 *         description: User created
 *   put:
 *     summary: Update an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the user to update
 *               nickname:
 *                 type: string
 *                 description: The new nickname of the user
 *             required:
 *               - id
 *               - nickname
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the user to delete
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: User deleted
 */

import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  CreateUser,
  UpdateUser,
  DeleteUser,
  getUser,
  getUsers,
} from "@/lib/dto/user.dto";
import { errorResponse, successResponse } from "@/lib/utils/response";

const prisma = new PrismaClient();

// GET /api/users?id=1
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) {
        return errorResponse("User not found", 404);
      }
      const dto: getUser = {
        data: {
          id: user.id,
          nickname: user.nickname,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        statusCode: 200,
      };
      return successResponse(dto);
    } else {
      const users = await prisma.user.findMany();
      const dto: getUsers = {
        data: users.map((user) => ({
          id: user.id,
          nickname: user.nickname,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        })),
        total: users.length,
        statusCode: 200,
      };
      return successResponse(dto);
    }
  } catch (error: unknown) {
    return errorResponse(error, 500);
  }
}

// POST /api/users
export async function POST(req: NextRequest) {
  try {
    const body: CreateUser = await req.json();
    if (!body.nickname) {
      return errorResponse("Missing nickname", 400);
    }
    const user = await prisma.user.create({
      data: { nickname: body.nickname },
    });
    const dto: getUser = {
      data: {
        id: user.id,
        nickname: user.nickname,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      statusCode: 201,
    };
    return successResponse(dto, "User created", 201);
  } catch (error: unknown) {
    return errorResponse(error, 500);
  }
}

// PUT /api/users
export async function PUT(req: NextRequest) {
  try {
    const body: UpdateUser & { id?: number } = await req.json();
    if (!body.id) {
      return errorResponse("Missing id", 400);
    }
    const user = await prisma.user.update({
      where: { id: body.id },
      data: { nickname: body.nickname },
    });
    const dto: getUser = {
      data: {
        id: user.id,
        nickname: user.nickname,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      statusCode: 200,
    };
    return successResponse(dto, "User updated");
  } catch (error: unknown) {
    return errorResponse(error, 500);
  }
}

// DELETE /api/users
export async function DELETE(req: NextRequest) {
  try {
    const body: DeleteUser = await req.json();
    if (!body.id) {
      return errorResponse("Missing id", 400);
    }
    await prisma.user.delete({ where: { id: body.id } });
    return successResponse(null, "User deleted", 200);
  } catch (error: unknown) {
    return errorResponse(error, 500);
  }
}
