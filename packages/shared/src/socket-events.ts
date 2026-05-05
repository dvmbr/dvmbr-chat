export const SOCKET_EVENTS = {
  MESSAGE_CREATED: "message:created",
} as const;

export type SocketEvent =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];