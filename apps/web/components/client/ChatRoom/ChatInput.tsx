"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

type ChatInputProps = {
  onSend: (msg: string) => void;
};

export default function ChatInput({ onSend }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  }, [onSend, value]);

  // Close emoji picker on outside click (except emoji button)
  useEffect(() => {
    if (!showEmojiPicker) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <section className="bg-background/80 supports-backdrop-filter:bg-background/60 mx-4 mt-4 mb-4 flex items-end justify-between gap-2 rounded-4xl border p-2 backdrop-blur">
      <div className="relative max-sm:hidden">
        <button
          ref={emojiButtonRef}
          className="flex items-center justify-center p-1 transition-transform duration-150 active:scale-90"
          type="button"
          onClick={() => setShowEmojiPicker((v) => (v ? false : true))}
          aria-label="Toggle emoji picker"
        >
          <Smile className="text-foreground h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full -left-4 z-50 mb-2 shadow-lg"
          >
            <EmojiPicker
              theme={Theme.DARK}
              onEmojiClick={(emoji: EmojiClickData) => {
                setValue(value + emoji.emoji);
                // Focus textarea so Enter triggers send
                textareaRef.current?.focus();
              }}
            />
          </div>
        )}
      </div>
      <Textarea
        ref={textareaRef}
        rows={1}
        className="min-h-0! max-h-32 w-full resize-none self-center overflow-y-auto scrollbar-none rounded-lg bg-transparent! pl-1 text-base! shadow-sm transition-all p-0"
        placeholder="Message..."
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey &&
            e.nativeEvent.isComposing === false
          ) {
            e.preventDefault();
            setShowEmojiPicker(false);
            handleSend();
          }
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="bg-foreground hover:bg-background disabled:bg-muted group flex items-center justify-center rounded-full p-1 transition-colors duration-150 active:scale-90 disabled:cursor-not-allowed disabled:active:scale-100"
        type="button"
        onClick={handleSend}
        disabled={value.trim() === ""}
      >
        <ArrowUp className="text-background group-hover:text-foreground group-disabled:text-background h-5 w-5 transition-colors duration-150 sm:h-6 sm:w-6" />
      </button>
    </section>
  );
}
