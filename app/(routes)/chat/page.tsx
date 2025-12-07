import {redirect} from "next/navigation";
import {getCurrentUser} from "@/app/(server)/lib/auth";
import ChatWrapper from "./_client/ChatWrapper";
import {
  getLastMessagesForAllRooms,
  getUnreadCountsByRoom,
} from "@/app/(server)/lib/message";
import {getRooms} from "@/app/(server)/lib/room";

export default async function ChatPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/login");
  }

  const userId = sessionUser.id;
  const userName = sessionUser.name;

  const [rooms, lastMessageMap, unreadCountsMap] = await Promise.all([
    getRooms(),
    getLastMessagesForAllRooms(),
    getUnreadCountsByRoom(userId),
  ]);

  return (
    <ChatWrapper
      userName={userName}
      initialRoomsData={{rooms, lastMessageMap, unreadCountsMap}}
    />
  );
}
