export {
  MessageCreatedPayloadSchema,
  MessageTypeSchema,
  parseMessageCreatedPayload,
} from "./payloads/message";
export type { MessageCreatedPayload, MessageType } from "./payloads/message";

export {
  RoomUnreadCountUpdatedPayloadSchema,
  UserRoomUnreadCountPayloadSchema,
  parseRoomUnreadCountUpdatedPayload,
  parseUserRoomUnreadCountPayload,
} from "./payloads/room";
export type {
  RoomUnreadCountUpdatedPayload,
  UserRoomUnreadCountPayload,
} from "./payloads/room";

export { AiModeChangedPayloadSchema } from "./payloads/ai";
export type { AiModeChangedPayload } from "./payloads/ai";

export { SocketConnectionQuerySchema } from "./query";
export type { SocketConnectionQuery } from "./query";

export type { ClientToServerEvents, ServerToClientEvents } from "./contract";

export { SOCKET_INTERNAL_SECRET_HEADER } from "./internal";
export { SOCKET_EVENTS } from "./events";
export type { SocketEvent } from "./events";
