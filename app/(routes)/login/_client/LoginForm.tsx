"use client";

import {useRouter} from "next/navigation";
import {useState, FormEvent} from "react";
import {useLoginMutation} from "@/app/redux/features/authApi";
import {getRtkErrorMessage} from "@/app/redux/utils/getRtkErrorMessage";
import {usePreventDoubleSubmit} from "@/app/hooks/usePreventDoubleSubmit";

export default function LoginForm() {
  const router = useRouter();
  const {isSubmitting, startSubmit, endSubmit} = usePreventDoubleSubmit();
  const [triggerLogin, {isError, error}] = useLoginMutation();
  const [username, setUsername] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    startSubmit();

    const trimmed = username.trim();

    try {
      await triggerLogin({userName: trimmed});
      router.push("/chat");
    } catch (e) {
      console.error(e);
      endSubmit();
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

      {isError && (
        <p className="text-sm text-error">{getRtkErrorMessage(error)}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-brand-mint text-bg-primary py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent-mintLight transition"
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
