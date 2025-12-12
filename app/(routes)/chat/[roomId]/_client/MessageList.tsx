"use client";

import {MessageVM} from "../_server/MessageVM";
import {useEffect, useRef} from "react";

type Props = {
  meId: string;
  messages: MessageVM[];
};

function formatDateLabel(date: Date) {
  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) return "오늘";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}.${m}.${d}`;
}

export default function MessageList({meId, messages}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  let lastDateKey: string | null = null;
  return (
    <div
      className="flex-1 overflow-y-auto space-y-3 p-4 min-h-0"
      ref={containerRef}
    >
      {messages.length === 0 ? (
        <p className="text-sm text-text-secondary">아직 메시지가 없습니다.</p>
      ) : (
        messages.map((m, i) => {
          const isMine = meId === m.userId;
          const messageDate = new Date(m.createdAt);
          const dateKey = messageDate.toDateString();
          const showDateDivider = lastDateKey !== dateKey;
          lastDateKey = dateKey;
          return (
            <div key={m.id + `-${i}`}>
              {/* 날짜 구분선 */}
              {showDateDivider && (
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-surface-border" />
                  <span className="mx-3 text-xs text-text-muted whitespace-nowrap">
                    {formatDateLabel(messageDate)}
                  </span>
                  <div className="flex-1 border-t border-surface-border" />
                </div>
              )}

              {/* 메시지 */}
              <div
                className={`flex items-end gap-2 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {/* 내 메시지 시간 (왼쪽) */}
                {isMine && (
                  <span className="text-[11px] text-text-muted whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}

                {/* 말풍선 + 이름 */}
                <div className="max-w-[78%] flex flex-col">
                  {!isMine && (
                    <p className="text-xs text-text-muted mb-1">
                      {m.userName ?? "알 수 없는 사용자"}
                    </p>
                  )}

                  <div
                    className={`px-3 py-2 border border-surface-border text-sm leading-relaxed whitespace-pre-wrap wrap-break-word break-all
                    ${
                      isMine
                        ? "bg-brand-mint text-black rounded-2xl rounded-br-sm"
                        : "bg-bg-secondary text-text-primary rounded-2xl rounded-bl-sm"
                    }
                  `}
                  >
                    {m.text}
                  </div>
                </div>

                {/* 상대 메시지 시간 (오른쪽) */}
                {!isMine && (
                  <span className="text-[11px] text-text-muted whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
