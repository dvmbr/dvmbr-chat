import { create } from "zustand";

type RoomState = {
  roomId: number | null;
  roomName: string | null;

  setRoom: (roomId: number | null, roomName: string | null) => void;
  clearRoom: () => void;
};

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  roomName: null,

  setRoom: (roomId, roomName) =>
    set({
      roomId,
      roomName,
    }),

  clearRoom: () =>
    set({
      roomId: null,
      roomName: null,
    }),
}));
