import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  userId: number | null;
  nickname: string | null;

  setUser: (userId: number | null, nickname: string | null) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      nickname: null,

      setUser: (userId, nickname) =>
        set({
          userId,
          nickname,
        }),
    }),
    {
      name: "dvmbr-chat-user-storage",
    },
  ),
);
