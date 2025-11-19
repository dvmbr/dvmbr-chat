"use client";

import {ChatMessage} from "@/types/chat";

type Props = {
  messages: ChatMessage[];
};

export default function MessageList({messages}: Props) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
      {messages.length === 0 ? (
        <p className="text-sm text-text-secondary">아직 메시지가 없습니다.</p>
      ) : (
        messages.map((m) => (
          <div
            key={m.id}
            className="px-3 py-2 bg-bg-secondary border border-surface-border rounded-md"
          >
            {/* 나중에 '나/상대' 구분, 아바타, 닉네임 추가 가능 */}
            <p className="text-xs text-text-muted mb-1">
              {m.username ?? "알 수 없는 사용자"}
            </p>
            <p className="text-sm text-text-primary">{m.text}</p>
            <p className="text-xs text-text-muted mt-1">
              {new Date(m.createdAt).toLocaleString("ko-KR")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
