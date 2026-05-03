"use client";

import AppHeader from "./AppHeader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative container mx-auto flex h-dvh w-full max-w-3xl flex-col overflow-hidden">
      <AppHeader />

      <main className="min-h-0 flex-1">{children}</main>

      <footer className="text-muted-foreground px-4 py-1 text-center text-xs">
        © {new Date().getFullYear()} DVMBR. All rights reserved.
      </footer>
    </div>
  );
}
