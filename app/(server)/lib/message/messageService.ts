import {prisma} from "../db";
import {MessageDTO, toMessageDTO} from "./messageDTO";

// 특정 채팅방의 메시지들 조회
export async function getMessagesByRoomId(
  roomId: string
): Promise<MessageDTO[]> {
  const messages = await prisma.message.findMany({
    where: {roomId},
    orderBy: {createdAt: "asc"},
    include: {
      user: true,
    },
  });

  return messages.map(toMessageDTO);
}

// 특정 방에 새 메시지 생성
export async function createMessage(params: {
  roomId: string;
  userId: string;
  text: string;
  createdAt?: Date;
}): Promise<MessageDTO> {
  const {roomId, userId, text, createdAt} = params;

  // createdAt을 넘기면 그 값 쓰고, 아니면 DB default(now()) 사용
  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        text,
        userId,
        roomId,
        ...(createdAt && {createdAt}), // undefined면 아예 필드를 안 보냄
      },
      include: {
        user: true, // toMessageDTO 시그니처 맞추기
      },
    }),
    prisma.room.update({
      where: {id: roomId},
      data: {
        updatedAt: createdAt ?? new Date(), // 방 최신 활동 시간 갱신
      },
    }),
  ]);

  return toMessageDTO(message);
}

// 방별 안 읽은 메시지 개수 맵
export type UnreadCountMap = Record<string, number>;

// 특정 user 기준으로, 방별 안 읽은 메시지 개수 가져오기
export async function getUnreadCountsByRoom(
  userId: string
): Promise<UnreadCountMap> {
  const rows = await prisma.message.groupBy({
    by: ["roomId"],
    where: {
      // 내가 보낸 메시지는 제외
      userId: {
        not: userId,
      },
      // 내가 아직 읽지 않은 메시지만
      reads: {
        none: {
          userId,
        },
      },
    },
    _count: {
      _all: true,
    },
  });

  const map: UnreadCountMap = {};
  for (const row of rows) {
    map[row.roomId] = row._count._all;
  }

  return map; // 메시지 없으면 그냥 {} 반환
}

export type LastMessageDTOMap = Record<string, MessageDTO>;

export async function getLastMessagesByRoom(): Promise<LastMessageDTOMap> {
  // 1) 각 방의 최신 createdAt 그룹화
  const grouped = await prisma.message.groupBy({
    by: ["roomId"],
    _max: {createdAt: true},
  });

  if (grouped.length === 0) return {};

  // 2) groupBy 결과로 최신 메시지 전체 조회
  const messages = await prisma.message.findMany({
    where: {
      OR: grouped.map((g) => ({
        roomId: g.roomId,
        createdAt: g._max.createdAt!, // 해당 room의 최신 메시지 시간
      })),
    },
    include: {
      user: true,
    },
  });

  const map: LastMessageDTOMap = {};

  for (const m of messages) {
    map[m.roomId] = toMessageDTO(m);
  }

  return map;
}
