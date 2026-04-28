"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type LoadingViewProps = {
  text: string;
  className?: string;
};

export default function LoadingView({ text, className }: LoadingViewProps) {
  return (
    <div
      className={cn(
        "bg-background/60 fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 backdrop-blur-sm",
        className,
      )}
    >
      <Loader2 className="text-foreground h-8 w-8 animate-spin" />
      <span className="text-muted-foreground text-base font-medium">
        {text}
      </span>
    </div>
  );
}
