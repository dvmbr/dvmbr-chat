import { create } from "zustand";

type State = {
  isLoading: boolean;
  text: string;
  show: (text?: string) => void;
  hide: () => void;
};

export const loadingStore = create<State>((set) => ({
  isLoading: false,
  text: "Loading...",
  show: (text = "Loading...") => set({ isLoading: true, text }),
  hide: () => set({ isLoading: false }),
}));
