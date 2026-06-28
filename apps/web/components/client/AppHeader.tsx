"use client";

import AiToggleButton from "@/components/client/AiToggleButton";
import UserProfilePopover from "@/components/client/UserProfilePopover";
import { roomStore } from "@/lib/stores/roomStore";
import { DoorOpen, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const { roomName, clearRoom } = roomStore();
  const pathname = usePathname();

  const isChatRoomPage = /^\/rooms\/\d+$/.test(pathname) || pathname === "/";

  return (
    <header className="grid grid-cols-3 items-center px-4 py-2">
      <h1 className="text-muted-foreground! text-sm! font-normal! tracking-normal! sm:text-base!">
        DVMBR Chat
      </h1>

      <div className="flex justify-center">
        {isChatRoomPage && <AiToggleButton />}
      </div>

      <div className="flex flex-col items-end">
        {isChatRoomPage && (
          <i className="text-muted-foreground text-sm sm:text-base">
            {roomName}
          </i>
        )}

        <div className="flex gap-x-2">
          <UserProfilePopover>
            <button title="Profile" className="text-muted-foreground hover:text-foreground transition-colors">
              <User />
            </button>
          </UserProfilePopover>
          {isChatRoomPage && (
            <Link
              href="/rooms"
              onClick={clearRoom}
              title="Leave room"
              className="text-muted-foreground hover:text-foreground block transition-colors sm:text-base"
            >
              <DoorOpen />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
