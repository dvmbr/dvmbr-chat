export type MessageDTO = {
  id: string;
  text: string;
  roomId: string;
  userId: string;
  userName: string;
  createdAt: Date;
  isPending?: boolean;
};

// Prisma 결과 -> MessageDTO 변환 헬퍼
export function toMessageDTO(m: {
  id: string;
  text: string;
  roomId: string;
  createdAt: Date;
  user: {id: string; name: string};
}): MessageDTO {
  return {
    id: m.id,
    text: m.text,
    createdAt: m.createdAt,
    roomId: m.roomId,
    userId: m.user.id,
    userName: m.user.name,
  };
}
