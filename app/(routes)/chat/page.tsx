import {redirect} from "next/navigation";
import {getCurrentUser} from "@/app/(server)/lib/auth/authService";
import ChatWrapper from "./_client/ChatWrapper";
import {toRoomListVM} from "./_server/roomVM";
import {getRooms} from "@/app/(server)/lib/room/roomService";

export default async function ChatPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/login");
  }

  const roomListDTO = await getRooms({userId: sessionUser.id});
  const roomListVM = toRoomListVM(roomListDTO);

  return <ChatWrapper user={sessionUser} viewModel={roomListVM} />;
}
