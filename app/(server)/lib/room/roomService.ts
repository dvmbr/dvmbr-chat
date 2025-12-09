import {Room, RoomMember} from "@prisma/client";
import {prisma} from "../db";
import {RoomDTO, toRoomDTO} from "./roomDTO";
import {
  LastMessageDTOMap,
  UnreadCountMap,
  getLastMessagesByRoom,
  getUnreadCountsByRoom,
} from "../message/messageService";

/**
 * 1. 방 생성하기
 *  - hostId를 방의 호스트로 설정
 *  - 동시에 RoomMember에도 호스트를 첫 멤버로 추가
 *  - RoomDTO로 반환 (unreadCount 0, lastMessage 없음)
 */

export type CreateRoomParams = {
  roomName: string;
  hostId: string;
};
export async function createRoom({
  roomName,
  hostId,
}: CreateRoomParams): Promise<RoomDTO> {
  const name = roomName.trim();

  if (!name) {
    throw new Error("Room name cannot be empty.");
  }

  const room = await prisma.room.create({
    data: {
      name,
      hostId,
      members: {
        create: {
          userId: hostId,
        },
      },
    },
  });

  return toRoomDTO({
    room,
    unreadCount: 0,
  });
}

/**
 * 2. 방 입장 시 해당 방의 멤버로 등록하기
 *  - 이미 멤버면 그대로 반환
 *  - 아니면 새로 RoomMember 생성
 */
export type JoinRoomParams = {
  roomId: string;
  userId: string;
};
export async function joinRoom({
  roomId,
  userId,
}: JoinRoomParams): Promise<RoomMember> {
  const member = await prisma.roomMember.upsert({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
    update: {},
    create: {
      userId,
      roomId,
    },
  });

  return member;
}

/**
 * 3. 방 목록 가져오기
 *  - 정렬은 최근 활동(updatedAt) 순
 */
export async function getRooms_old(): Promise<RoomDTO[]> {
  const rooms: Room[] = await prisma.room.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return rooms.map((room) =>
    toRoomDTO({
      room,
      unreadCount: 0,
    })
  );
}

/**
 * DB 모든 방 기준
 * - lastMessage (MessageDTO)
 * - unreadCount (userId 기준)
 * 포함한 RoomDTO[] 반환
 */
export type GetRoomsParams = {userId: string};
export async function getRooms({userId}: GetRoomsParams): Promise<RoomDTO[]> {
  // 1) 방 목록 가져오기
  const rooms = await prisma.room.findMany({
    orderBy: {updatedAt: "desc"},
  });

  // 2) 메타 정보 결합
  const [lastMap, unreadMap]: [LastMessageDTOMap, UnreadCountMap] =
    await Promise.all([getLastMessagesByRoom(), getUnreadCountsByRoom(userId)]);

  // 3) DTO 조합
  return rooms.map((room) =>
    toRoomDTO({
      room,
      lastMessage: lastMap[room.id] ?? null,
      unreadCount: unreadMap[room.id] ?? 0,
    })
  );
}

export async function getRoomByRoomId(roomId: string): Promise<Room | null> {
  const room = await prisma.room.findUnique({
    where: {id: roomId},
  });

  return room;
}

export type MarkMessagesReadInRoomParams = {
  roomId: string;
  userId: string;
};
export async function markMessagesReadInRoom({
  roomId,
  userId,
}: MarkMessagesReadInRoomParams) {
  const unreadMessages = await prisma.message.findMany({
    where: {
      roomId,
      userId: {not: userId},
      reads: {
        none: {userId},
      },
    },
    select: {id: true},
  });

  if (unreadMessages.length === 0) return;

  await prisma.messageRead.createMany({
    data: unreadMessages.map((m) => ({
      userId,
      messageId: m.id,
    })),
    skipDuplicates: true,
  });
}
