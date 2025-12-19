"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useLoginMutation } from "@/app/redux/features/authApi";
import { getRTKErrorMessage } from "@/app/redux/utils/getRTKErrorMessage";
import { usePreventDoubleSubmit } from "@/app/hooks/usePreventDoubleSubmit";
import { useGlobalLoading } from "@/app/components/providers/GlobalLoadingProvider";

export default function LoginForm() {
  const router = useRouter();
  const { isSubmitting, startSubmit, endSubmit } = usePreventDoubleSubmit();
  const { showGlobalLoading, hideGlobalLoading } = useGlobalLoading();
  const [triggerLogin, { isError, error }] = useLoginMutation();
  const [userName, setUserName] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    startSubmit();
    showGlobalLoading();

    const trimmed = userName.trim();

    try {
      await triggerLogin({ userName: trimmed }).unwrap();
      router.push("/chat");
    } catch (e) {
      console.error(e);
      endSubmit();
      hideGlobalLoading();
    }
  }

  const isDisabled = isSubmitting || userName.length < 1;
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-text-muted">
          닉네임
        </label>

        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="예: dvmbr"
          className="w-full rounded-md border border-border bg-bg-elevate px-3 py-2 text-sm text-text-main placeholder:text-text-muted/70 outline-none transition focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
      </div>

      {isError && (
        <p className="text-sm text-error">{getRTKErrorMessage(error)}</p>
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className="w-full rounded-md bg-secondary py-2 text-sm font-medium text-bg-deep transition hover:bg-secondary/70 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
