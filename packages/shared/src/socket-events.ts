export const SOCKET_EVENTS = {
  MESSAGE_CREATED: "message:created",
  ROOM_UNREAD_COUNT_UPDATED: "room:unread-count-updated",
} as const;

export type SocketEvent =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];