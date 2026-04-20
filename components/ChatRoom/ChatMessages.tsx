"use client";

import { useRef, useEffect } from "react";

type ChatMessagesProps = {
  messages: string[];
};

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex h-full flex-col overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center">
          <h2 className="mb-4 text-center text-4xl! sm:text-6xl!">
            Hi! It&apos;s Dvmbr Chat!
            <span className="animate-wave inline-block origin-[70%_70%]">
              👋
            </span>
          </h2>
          <p className="max-w-xs text-center sm:max-w-none">
            This is a chat application built with Next.js, Tailwind CSS, and
            shadcn/ui.
          </p>
        </div>
      ) : (
        <ul className="flex w-full flex-col gap-2">
          {messages.map((msg, idx) => (
            <li
              key={idx}
              className="bg-muted max-w-[80%] self-end rounded-2xl rounded-br-sm px-4 py-2 wrap-break-word shadow-md"
            >
              {msg}
            </li>
          ))}
        </ul>
      )}
      <div ref={bottomRef} />
    </section>
  );
}
