"use client";

import { useSyncExternalStore } from "react";
import { USER_ID_KEY } from "@/lib/constants";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (event: StorageEvent) => {
    if (event.key === USER_ID_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener("storage", handleStorage);
  };
}

function getServerSnapshot() {
  return null;
}

function getClientSnapshot() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_ID_KEY);
}

export function useStoredUserId() {
  const storedUserId = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!storedUserId) {
    return {
      userId: null,
      isValidUserId: false,
      message: "User ID is missing.",
    };
  }

  const userId = Number(storedUserId);

  if (!Number.isFinite(userId)) {
    return {
      userId: null,
      isValidUserId: false,
      message: "Invalid user ID.",
    };
  }

  return {
    userId,
    isValidUserId: true,
    message: null,
  };
}
