"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LoadingContextValue = {
  isGlobalLoading: boolean;
  showGlobalLoading: () => void;
  hideGlobalLoading: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function GlobalLoadingProvider({children}: {children: ReactNode}) {
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
      {isGlobalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
            <p className="text-sm text-white">Loading...</p>
          </div>
        </div>
      )}
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
