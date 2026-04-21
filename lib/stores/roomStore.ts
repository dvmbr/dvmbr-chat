import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoomState = {
  roomId: number | null;
  roomName: string | null;

  setRoom: (roomId: number | null, roomName: string | null) => void;
};

export const useRoomStore = create<RoomState>()(
  persist(
    (set) => ({
      roomId: null,
      roomName: null,

      isEntryPending: false,
      isEntryError: false,

      setRoom: (roomId, roomName) =>
        set({
          roomId,
          roomName,
        }),
    }),
    {
      name: "dvmbr-chat-room-storage",
    },
  ),
);
