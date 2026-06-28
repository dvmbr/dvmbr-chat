"use client";

import { roomStore } from "@/lib/stores/roomStore";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

export default function AiToggleButton() {
  const { isAiMode, toggleAiMode, isRoomCreator, isAiLoading } = roomStore();
  const canToggle = isRoomCreator && !isAiLoading;

  return (
    <button
      onClick={canToggle ? toggleAiMode : undefined}
      disabled={!canToggle}
      title={isAiMode ? "AI 끄기" : "AI 켜기"}
      className="relative flex items-center justify-center p-2 disabled:cursor-not-allowed"
    >
      {isAiMode && (
        <>
          <div
            className="animate-rotate-border absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #ff3131, #67fff0, #ff3131)",
            }}
          />
          <div className="bg-background absolute inset-1 rounded-full" />
        </>
      )}
      <Bot
        className={cn("relative z-10 h-8 w-8", {
          "text-muted-foreground hover:text-foreground animate-ai-appeal transition-colors": !isAiMode,
        })}
      />
    </button>
  );
}
