import { create } from "zustand";

type RoomState = {
  roomId: number | null;
  roomName: string | null;
  participantId: number | null;
  isAiMode: boolean;
  isAiLoading: boolean;
  isRoomCreator: boolean;

  setRoom: (
    roomId: number | null,
    roomName: string | null,
    participantId: number | null,
  ) => void;

  clearRoom: () => void;
  toggleAiMode: () => void;
  setAiMode: (value: boolean) => void;
  setIsAiLoading: (value: boolean) => void;
  setIsRoomCreator: (value: boolean) => void;
};

export const roomStore = create<RoomState>((set) => ({
  roomId: null,
  roomName: null,
  participantId: null,
  isAiMode: false,
  isAiLoading: false,
  isRoomCreator: false,

  isEntryPending: false,
  isEntryError: false,

  setRoom: (roomId, roomName, participantId) =>
    set({
      roomId,
      roomName,
      participantId,
    }),

  clearRoom: () =>
    set({ roomId: null, roomName: null, participantId: null, isAiMode: false, isAiLoading: false, isRoomCreator: false }),

  toggleAiMode: () => set((state) => ({ isAiMode: !state.isAiMode })),
  setAiMode: (value) => set({ isAiMode: value }),
  setIsAiLoading: (value) => set({ isAiLoading: value }),
  setIsRoomCreator: (value) => set({ isRoomCreator: value }),
}));
