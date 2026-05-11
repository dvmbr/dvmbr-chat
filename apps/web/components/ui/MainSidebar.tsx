"use client";

import { userStore } from "@/lib/stores/userStore";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import Link from "next/link";
import { Button } from "./button";

export default function MainSidebar() {
  const nickname = userStore((state) => state.nickname);
  const safeNickname = nickname || "Unknown User";
  const { setOpenMobile } = useSidebar();

  const avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(nickname!)}&backgroundColor=#000000&color=ffffff`;

  const handleNavigate = () => setOpenMobile(false);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-white/10 px-4 py-6">
        <h1 className="text-brand-red text-2xl tracking-tight drop-shadow-lg select-none">
          DVMBR CHAT
        </h1>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <SidebarGroup>
          <nav className="flex flex-col gap-2">
            <Link href="/rooms" onClick={handleNavigate}>
              <Button
                className="hover:text-brand-mint w-full justify-start text-lg transition-colors duration-500"
                variant={"ghost"}
                size="lg"
              >
                Room List
              </Button>
            </Link>
          </nav>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-background relative flex items-center justify-center rounded-full p-px">
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
                <AvatarFallback>
                  {safeNickname.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <span className="max-w-25 truncate text-sm font-semibold">
            {safeNickname}
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
