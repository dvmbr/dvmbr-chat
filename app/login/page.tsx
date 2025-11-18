"use client";

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = username.trim();
    if (!trimmed) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: trimmed}),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "로그인에 실패했습니다.");
        return;
      }

      router.push("/chat");
    } catch (e) {
      console.error("Login error:", e);
      setError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
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
            disabled={loading}
            className="w-full rounded bg-brand-mint text-bg-primary py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent-mintLight transition"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
