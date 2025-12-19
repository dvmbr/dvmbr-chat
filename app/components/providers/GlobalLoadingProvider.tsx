"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import FullPageLoading from "../FullPageLoading";

type LoadingContextValue = {
  isGlobalLoading: boolean;
  showGlobalLoading: () => void;
  hideGlobalLoading: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const isGlobalLoading = count > 0;

  const showGlobalLoading = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const hideGlobalLoading = useCallback(() => {
    setCount((c) => (c > 0 ? c - 1 : 0));
  }, []);

  const value = useMemo(
    () => ({
      isGlobalLoading,
      showGlobalLoading,
      hideGlobalLoading,
    }),
    [isGlobalLoading, showGlobalLoading, hideGlobalLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isGlobalLoading && <FullPageLoading text={"dvmbr-chat is loading..."} />}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useGlobalLoading must be used within LoadingProvider");
  }
  return ctx;
}
