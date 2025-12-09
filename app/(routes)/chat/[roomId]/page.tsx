import {getCurrentUser} from "@/app/(server)/lib/auth/authService";
import {getMessagesByRoomId} from "@/app/(server)/lib/message/messageService";

import {redirect, notFound} from "next/navigation";

import {getRoomByRoomId} from "@/app/(server)/lib/room/roomService";
import {toMessageListVM} from "./_server/MessageVM";
import RoomWrapper from "./_client/RoomWrapper";

type Props = {
  params: Promise<{roomId: string}>;
};

export default async function RoomPage({params}: Props) {
  const {roomId} = await params;
  if (!roomId) notFound();

  // 세션 검사
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/login");
  }

  // 방 정보 조회
  const room = await getRoomByRoomId(roomId);

  if (!room) {
    notFound();
  }

  const messages = await getMessagesByRoomId(roomId);
  const messageListVM = toMessageListVM(messages);

  return (
    <RoomWrapper
      roomId={roomId}
      roomName={room.name}
      sessionUser={sessionUser}
      messages={messageListVM}
    />
  );
}
