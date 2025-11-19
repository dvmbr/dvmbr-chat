import {Room} from "@prisma/client";
import {prisma} from "./db";

// 채팅방 목록 조회 (최신 방이 위로 오도록 정렬)
export async function getRooms(): Promise<Room[]> {
  const rooms = await prisma.room.findMany({
    orderBy: {createdAt: "desc"},
  });

  return rooms;
}

export async function getRoomByRoomId(roomId: string): Promise<Room | null> {
  const room = await prisma.room.findUnique({
    where: {id: roomId},
  });

  return room;
}

// 새 채팅방 생성
export async function createRoom(rawName: string): Promise<Room> {
  const trimmed = rawName.trim();

  const room = await prisma.room.create({
    data: {
      name: trimmed,
    },
  });

  return room;
}
