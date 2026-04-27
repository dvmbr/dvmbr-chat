import { create } from "zustand";

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

export const roomStore = create<RoomState>((set) => ({
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
}));
