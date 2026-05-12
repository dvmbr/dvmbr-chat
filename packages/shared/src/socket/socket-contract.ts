import { MessageCreatedPayload } from "./payloads/message.js";
import { RoomUnreadCountUpdatedPayload } from "./payloads/room.js";
import { SOCKET_EVENTS } from "./socket-events.js";

export interface ServerToClientEvents {
  [SOCKET_EVENTS.MESSAGE_CREATED]: (payload: MessageCreatedPayload) => void;

  [SOCKET_EVENTS.ROOM_UNREAD_COUNT_UPDATED]: (
    payload: RoomUnreadCountUpdatedPayload,
  ) => void;
}

export interface ClientToServerEvents {
  [SOCKET_EVENTS.MESSAGE_CREATED]: (payload: MessageCreatedPayload) => void;
}
