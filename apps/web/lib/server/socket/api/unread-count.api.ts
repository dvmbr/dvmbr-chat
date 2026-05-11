import "server-only";

import { socketClient } from "../socket-client";

type UnreadCountPayload = {
  roomId: number;
  userId: number;
  unreadCount: number;
};

export async function postUnreadCount(payloads: UnreadCountPayload[]) {
  await socketClient.post("internal/unread-count", {
    json: {
      payloads,
    },
  });
}
