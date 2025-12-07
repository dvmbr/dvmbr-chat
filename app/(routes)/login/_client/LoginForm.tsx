"use client";

import {AuthRequestBody} from "@/app/(server)/api/auth/route";
import {apiBody, apiFetch} from "@/app/utils/apiFetch";
import {useGlobalLoading} from "@/app/components/providers/GlobalLoadingProvider";
import {FetchError} from "@/app/errors/FetchError";
import {useRouter} from "next/navigation";
import {useState, FormEvent} from "react";

export default function LoginForm() {
  const router = useRouter();
  const {isGlobalLoading, showGlobalLoading, hideGlobalLoading} =
    useGlobalLoading();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isDisabled = username.trim() === "" || isGlobalLoading;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    showGlobalLoading();
    setError(null);
    const trimmed = username.trim();

    try {
      await apiFetch("/api/auth", {
        method: "POST",
        body: apiBody<AuthRequestBody>({userName: trimmed}),
      });

      router.push("/chat");
    } catch (e) {
      console.error(e);
      const err = e as FetchError;
      setError(err.message);
    } finally {
      hideGlobalLoading();
    }
  }
  return (
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
        {isGlobalLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
