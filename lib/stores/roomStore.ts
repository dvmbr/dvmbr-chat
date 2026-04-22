import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoomState = {
  roomId: number | null;
  roomName: string | null;
  participantId: number | null;

  setRoom: (
    roomId: number | null,
    roomName: string | null,
    participantId: number | null,
  ) => void;
};

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      roomId: null,
      roomName: null,
      participantId: null,

      isEntryPending: false,
      isEntryError: false,

      setRoom: (roomId, roomName, participantId) =>
        set({
          roomId,
          roomName,
          participantId,
        }),
    }),
    {
      name: "dvmbr-chat-room-storage",
    },
  ),
);
