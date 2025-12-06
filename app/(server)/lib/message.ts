import {prisma} from "./db";

export type Message = {
  id: string;
  text: string;
  roomId: string;
  userId: string;
  username: string;
  createdAt: Date;
  isPending?: boolean;
};

// 특정 채팅방의 메시지들 조회
export async function getMessagesByRoomId(roomId: string): Promise<Message[]> {
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

  return messages.map((m: (typeof messages)[number]) => ({
    id: m.id,
    text: m.text,
    createdAt: m.createdAt,
    roomId: m.roomId,
    userId: m.user.id,
    username: m.user.name,
  }));
}

// 특정 user 기준으로, 방별 안 읽은 메시지 개수 가져오기
export async function getUnreadCountsByRoom(
  userId: string
): Promise<Record<string, number> | undefined> {
  const rows = await prisma.message.groupBy({
    by: ["roomId"],
    where: {
      // 내가 멤버인 방들 중에서
      room: {
        members: {
          some: {userId},
        },
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

  if (rows.length === 0) return;

  // { [roomId]: count } 형태로 변환
  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.roomId] = row._count._all;
  }
  return map;
}

// 모든 채팅방의 최신 메시지들 조회
export async function getLastMessagesForAllRooms(): Promise<
  Record<string, string> | undefined
> {
  // 1) roomId별로 createdAt의 최대값만 구하기
  const grouped = await prisma.message.groupBy({
    by: ["roomId"],
    _max: {
      createdAt: true,
    },
  });

  // 메시지가 하나도 없다면 빈 객체 반환
  if (grouped.length === 0) {
    return;
  }

  // 2) (roomId, createdAt 최대값) 조합으로 실제 메시지들 조회
  const messages = await prisma.message.findMany({
    where: {
      OR: grouped.map((g: (typeof grouped)[number]) => ({
        roomId: g.roomId,
        createdAt: g._max.createdAt!, // groupBy로 구한 최신 createdAt
      })),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    // 보기 좋게 roomId 오름차순 + 같은 방 안에서는 최신이 위로
    orderBy: [{roomId: "asc"}, {createdAt: "desc"}],
  });

  const map: Record<string, string> = {};

  for (const m of messages) {
    // roomId마다 첫 번째 만나는 메시지가 그 방의 최신 메시지
    if (!map[m.roomId]) {
      map[m.roomId] = m.text;
    }
  }

  return map;
}

// 특정 방에 새 메시지 생성
export async function createMessage(params: {
  roomId: string;
  userId: string;
  text: string;
  createdAt?: Date;
}): Promise<Message> {
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
