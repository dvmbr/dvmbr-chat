"use client";

import { loadingStore } from "@/lib/stores/loadingStore";
import AppHeader from "./AppHeader";
import EntryGate from "./Entry/EntryGate";
import Loading from "./ui/Loading";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoading, text } = loadingStore();

  return (
    <div className="relative container mx-auto flex h-dvh w-full max-w-3xl flex-col overflow-hidden">
      {isLoading && <Loading text={text} />}
      <AppHeader />

      <main className="min-h-0 flex-1">
        <EntryGate>{children}</EntryGate>
      </main>

      <footer className="text-muted-foreground px-4 py-1 text-center text-xs">
        © {new Date().getFullYear()} DVMBR. All rights reserved.
      </footer>
    </div>
  );
}
