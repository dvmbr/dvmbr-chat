"use client";

import { MessageVM } from "../_server/MessageVM";
import { useEffect, useRef } from "react";
import DateDivider from "./DateDivider";
import MessageBubble from "./MessageBubble";

type Props = {
  meId: string;
  messages: MessageVM[];
};

export default function MessageList({ meId, messages }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  let lastDateKey: string | null = null;
  return (
    <div
      className="flex-1 min-h-0 space-y-3 overflow-y-auto p-4"
      ref={containerRef}
    >
      {messages.length === 0 ? (
        <p className="text-sm text-text-muted">아직 메시지가 없습니다.</p>
      ) : (
        messages.map((m, i) => {
          const messageDate = new Date(m.createdAt);
          const dateKey = messageDate.toDateString();
          const showDateDivider = lastDateKey !== dateKey;
          lastDateKey = dateKey;

          return (
            <div key={m.id + `-${i}`}>
              {/* 날짜 구분선 */}
              {showDateDivider && <DateDivider date={messageDate} />}

              <MessageBubble meId={meId} message={m} />
            </div>
          );
        })
      )}
    </div>
  );
}
