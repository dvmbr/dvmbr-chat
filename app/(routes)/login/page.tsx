"use client";

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {apiFetch} from "@/lib/apiClient";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isDisabled = username.trim() === "" || loading;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);
    setLoading(true);
    const trimmed = username.trim();
    try {
      await apiFetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({name: trimmed}),
      });

      router.push("/chat");
    } catch (e) {
      console.error("Login failed:", e);
      setError("알 수 없는 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex items-center justify-center text-text-primary">
      <div className="w-full max-w-sm bg-surface rounded-xl shadow-lg border border-surface-border p-6">
        <h1 className="text-xl font-semibold mb-2">dvmbr Chat</h1>
        <p className="text-sm text-text-secondary mb-6">
          닉네임만 입력하면 바로 채팅을 시작할 수 있습니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-text-secondary">
              닉네임
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="예: dvmbr"
              className="w-full bg-bg-secondary border border-surface-border rounded px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint"
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full rounded bg-brand-mint text-bg-primary py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent-mintLight transition"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
