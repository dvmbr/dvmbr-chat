"use client";

import { useUserStore } from "@/lib/stores/userStore";
import { useRoomStore } from "@/lib/stores/roomStore";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

export default function MainSidebar() {
  const roomName = useRoomStore((state) => state.roomName);
  const nickname = useUserStore((state) => state.nickname);
  const avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(nickname!)}&backgroundColor=#000000&color=ffffff`;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-white/10 px-4 py-6">
        <h1 className="text-brand-red/80 text-2xl tracking-tight drop-shadow-lg select-none">
          DVMBR CHAT
        </h1>
        <p className="text-brand-mint/60! mt-1 text-xs! tracking-wide uppercase select-none">
          {roomName}
        </p>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <nav className="mt-2 flex flex-col gap-2">
            <Link
              href="/rooms"
              className="cursor-pointer rounded-lg px-3 py-2 font-medium text-white/90 uppercase transition-colors hover:bg-white/10"
            >
              Room List
            </Link>
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-background relative flex items-center justify-center rounded-full p-px">
            {/* 회전하는 그라데이션 테두리 */}
            <div
              className="animate-rotate-border absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, #ff3131, #67fff0, #ff3131)",
                zIndex: 0,
              }}
            />

            <div className="bg-background relative z-10 rounded-full">
              <Avatar size="lg">
                <AvatarImage
                  src={avatarUrl}
                  alt="Default avatar"
                  className="object-cover"
                />
                <AvatarFallback>DA</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <p className="max-w-25 truncate text-sm font-semibold text-white/90">
            {nickname}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
