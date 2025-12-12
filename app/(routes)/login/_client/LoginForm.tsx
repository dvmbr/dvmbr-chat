"use client";

import {useRouter} from "next/navigation";
import {useState, FormEvent} from "react";
import {useLoginMutation} from "@/app/redux/features/authApi";
import {getRTKErrorMessage} from "@/app/redux/utils/getRTKErrorMessage";
import {usePreventDoubleSubmit} from "@/app/hooks/usePreventDoubleSubmit";
import {useGlobalLoading} from "@/app/components/providers/GlobalLoadingProvider";

export default function LoginForm() {
  const router = useRouter();
  const {isSubmitting, startSubmit, endSubmit} = usePreventDoubleSubmit();
  const {showGlobalLoading, hideGlobalLoading} = useGlobalLoading();
  const [triggerLogin, {isError, error}] = useLoginMutation();
  const [username, setUsername] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    startSubmit();
    showGlobalLoading();

    const trimmed = username.trim();

    try {
      await triggerLogin({userName: trimmed}).unwrap();
      router.push("/chat");
    } catch (e) {
      console.error(e);
      endSubmit();
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

      {isError && (
        <p className="text-sm text-error">{getRTKErrorMessage(error)}</p>
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
