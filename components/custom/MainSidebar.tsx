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

export default function MainSidebar() {
  const roomName = useRoomStore((state) => state.roomName);
  const nickname = useUserStore((state) => state.nickname);
  return (
    <Sidebar>
      <SidebarHeader>
        <h1>header</h1>
        <p>{roomName}</p>
        <p>{nickname}</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div>item 1</div>
          <div>item 2</div>
          <div>item 3</div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>footer</SidebarFooter>
    </Sidebar>
  );
}
