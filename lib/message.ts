import {prisma} from "@/lib/db";
import type {ChatMessage} from "@/types/chat";

// 특정 채팅방의 메시지들 조회
export async function getMessagesByRoomId(
  roomId: string
): Promise<ChatMessage[]> {
  const messages = await prisma.message.findMany({
    where: {roomId},
    orderBy: {createdAt: "asc"},
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return messages.map((m) => ({
    id: m.id,
    text: m.text,
    createdAt: m.createdAt,
    roomId: m.roomId,
    userId: m.user.id,
    username: m.user.name,
  }));
}

// 특정 방에 새 메시지 생성
export async function createMessage(params: {
  roomId: string;
  userId: string;
  text: string;
  createdAt?: Date;
}): Promise<ChatMessage> {
  const {roomId, userId, text, createdAt} = params;

  const message = await prisma.message.create({
    data: {
      text,
      userId,
      roomId,
      createdAt,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    id: message.id,
    text: message.text,
    createdAt: message.createdAt,
    roomId: message.roomId,
    userId: message.user.id,
    username: message.user.name,
  };
}
