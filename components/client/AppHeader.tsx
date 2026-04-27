"use client";

import { roomStore } from "@/lib/stores/roomStore";
import { userStore } from "@/lib/stores/userStore";
import { DoorOpen, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const { roomName } = roomStore();
  const { nickname } = userStore();
  const pathname = usePathname();

  const isChatRoomPage = /^\/rooms\/\d+$/.test(pathname) || pathname === "/";

  return (
    <header className="flex items-center justify-between gap-x-4 px-4 py-2">
      <h1 className="text-muted-foreground! text-center text-sm! font-normal! tracking-normal! sm:text-base!">
        DVMBR Chat
      </h1>

      {isChatRoomPage && (
        <div className="flex flex-col items-end">
          <i className="text-muted-foreground text-sm sm:text-base">
            {roomName || (
              <span className="text-transparent">roomName placeholder</span>
            )}
          </i>
          <div className="flex gap-x-2">
            <User className="text-muted-foreground" />
            <Link
              href="#"
              className="text-muted-foreground hover:text-brand-red block transition-colors sm:text-base"
            >
              <DoorOpen />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
