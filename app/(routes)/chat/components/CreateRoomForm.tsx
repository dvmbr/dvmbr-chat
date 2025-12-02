"use client";

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {apiFetch} from "@/lib/apiClient";

export default function CreateRoomForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError("방 이름을 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/room", {
        method: "POST",
        body: JSON.stringify({name: trimmed}),
      });

      setName("");
      // 서버 컴포넌트(방 목록)를 다시 불러오기
      router.refresh();
    } catch (e) {
      console.error("Create room failed:", e);
      setError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="새 채팅방 이름"
          className="flex-1 bg-bg-secondary border border-surface-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-brand-mint text-bg-primary text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent-mintLight transition"
        >
          {loading ? "생성 중..." : "생성"}
        </button>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </form>
  );
}
