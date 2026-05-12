import "server-only";

import type { UserRoomUnreadCountPayload } from "@dvmbr/shared/socket/payloads/room";

import { socketClient } from "../socket-client";

export async function postUnreadCount(payloads: UserRoomUnreadCountPayload[]) {
  await socketClient.post("internal/unread-count", {
    json: {
      payloads,
    },
  });
}
