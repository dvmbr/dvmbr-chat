import {User} from "@prisma/client";
import {prisma} from "./db";

// ID로 유저 조회
export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({where: {id}});
  return user;
}

// 이름으로 유저 조회
export async function getUserByName(name: string): Promise<User | null> {
  const user = await prisma.user.findUnique({where: {name}});
  return user;
}

// 이름으로 유저 생성
export async function createUserByName(rawName: string): Promise<User> {
  const trimmed = rawName.trim();

  const user = await prisma.user.create({
    data: {name: trimmed},
  });

  return user;
}
