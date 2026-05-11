"use client";

import { useRef, useEffect } from "react";
import { MessageDTO } from "@/lib/schemas/message.schema";
import { cn } from "@/lib/utils";

type ChatMessagesProps = {
  participantId: number;
  messages: MessageDTO[];
};

export default function ChatMessages({
  participantId,
  messages,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    console.log(messages);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex h-full flex-col overflow-y-auto px-4">
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
        <ul>
          {messages.map((msg, idx) => {
            const isMe = participantId === msg.participantId;

            const prev = messages[idx - 1];
            const currTime = new Date(msg.createdAt).getTime();
            const isSameSender = prev?.participantId === msg.participantId;
            const isClose =
              prev != null &&
              Math.abs(currTime - new Date(prev.createdAt).getTime()) <
                60 * 1000;
            const isGrouped = isSameSender && isClose;

            const next = messages[idx + 1];
            const isSameSenderNext = next?.participantId === msg.participantId;
            const isCloseNext =
              next != null &&
              Math.abs(new Date(next.createdAt).getTime() - currTime) <
                60 * 1000;
            const isLastInGroup = !(isSameSenderNext && isCloseNext);

            const createdAt =
              new Date(msg.createdAt).getHours() +
              ":" +
              new Date(msg.createdAt).getMinutes().toString().padStart(2, "0");

            return (
              <li className="block" key={idx}>
                <div
                  className={cn("flex flex-col gap-1", {
                    "mt-1": isGrouped,
                    "mt-4": !isGrouped,
                    "items-end": isMe,
                    "items-start": !isMe,
                  })}
                >
                  {/* sender (only others) */}
                  {!isMe && !isGrouped && (
                    <span className="text-muted-foreground px-1 text-xs">
                      {msg.sender.nickname}
                    </span>
                  )}

                  <div
                    className={cn("flex w-full items-end gap-1", {
                      "flex-row-reverse": isMe,
                    })}
                  >
                    {/* message bubble */}
                    <div
                      className={cn(
                        "max-w-9/12 rounded-2xl px-4 py-2 shadow-sm",
                        {
                          "bg-primary text-primary-foreground rounded-br-sm":
                            isMe,
                          "bg-secondary text-secondary-foreground rounded-bl-sm":
                            !isMe,
                        },
                      )}
                    >
                      <p className="text-inherit!">{msg.content}</p>
                    </div>

                    {/* timestamp */}
                    {isLastInGroup && (
                      <small className="text-xs!">{createdAt}</small>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div ref={bottomRef} />
    </section>
  );
}
