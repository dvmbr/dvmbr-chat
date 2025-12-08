import {redirect} from "next/navigation";
import {getCurrentUser} from "@/app/(server)/lib/auth/authService";
import ChatWrapper from "./_client/ChatWrapper";
import {getRoomListViewModel} from "@/app/(server)/lib/room/utils";

export default async function ChatPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect("/login");
  }

  const userId = sessionUser.id;
  const userName = sessionUser.name;

  const roomListViewModel = await getRoomListViewModel(userId);

  return <ChatWrapper userName={userName} viewModel={roomListViewModel} />;
}
