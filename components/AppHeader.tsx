"use client";

import { DoorOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const pathname = usePathname();

  const isChatRoomPage = /^\/rooms\/\d+$/.test(pathname) || pathname === "/";

  return (
    <header className="flex items-center justify-between gap-x-4 px-4 py-2">
      <h1 className="text-muted-foreground! text-center text-sm! font-normal! tracking-normal! sm:text-base!">
        DVMBR Chat
      </h1>

      <div className="flex flex-wrap justify-center gap-x-2 text-sm sm:text-base">
        <span className="text-brand-red block text-center">room name</span>
        <span className="text-brand-mint block text-center">user</span>
      </div>

      {isChatRoomPage && (
        <Link
          href="/rooms"
          className="text-muted-foreground hover:text-foreground flex flex-wrap items-center justify-center text-sm font-normal transition-colors sm:text-base"
        >
          <span className="block text-nowrap">to rooms</span>
          <DoorOpen className="block" />
        </Link>
      )}
    </header>
  );
}
