import { MessageCreatedPayload } from "./payloads/message.js";
import { RoomUnreadCountUpdatedPayload } from "./payloads/room.js";
import { AiModeChangedPayload } from "./payloads/ai.js";
import { SOCKET_EVENTS } from "./events.js";

export interface ServerToClientEvents {
  [SOCKET_EVENTS.MESSAGE_CREATED]: (payload: MessageCreatedPayload) => void;
  [SOCKET_EVENTS.ROOM_UNREAD_COUNT_UPDATED]: (
    payload: RoomUnreadCountUpdatedPayload,
  ) => void;
  [SOCKET_EVENTS.AI_MODE_CHANGED]: (payload: AiModeChangedPayload) => void;
}

export interface ClientToServerEvents {
  [SOCKET_EVENTS.MESSAGE_CREATED]: (payload: MessageCreatedPayload) => void;
  [SOCKET_EVENTS.AI_MODE_CHANGED]: (payload: AiModeChangedPayload) => void;
}
