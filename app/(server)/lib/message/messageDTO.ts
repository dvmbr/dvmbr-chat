import {Message, User} from "@prisma/client";

export type MessageDTO = {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
};

// Prisma Message(+user 정보) -> MessageDTO로 변환
export function toMessageDTO(
  message: Message & {
    user: User;
  }
): MessageDTO {
  return {
    id: message.id,
    roomId: message.roomId,
    userId: message.userId,
    userName: message.user.name,
    text: message.text,
    createdAt: message.createdAt,
  };
}
