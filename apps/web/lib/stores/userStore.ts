import { create } from "zustand";

type UserState = {
  userId: number | null;
  nickname: string | null;

  setUser: (userId: number | null, nickname: string | null) => void;
};

export const userStore = create<UserState>((set) => ({
  userId: null,
  nickname: null,

  setUser: (userId, nickname) =>
    set({
      userId,
      nickname,
    }),
}));
