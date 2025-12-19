"use client";

import { useWebSocketClient } from "@/app/components/providers/WebSocketProvider";
import { usePreventDoubleSubmit } from "@/app/hooks/usePreventDoubleSubmit";
import { useLogoutMutation } from "@/app/redux/features/authApi";
import { getRTKErrorMessage } from "@/app/redux/utils/getRTKErrorMessage";

import { useRouter } from "next/navigation";

type Props = {
  userName: string;
};

export default function LogoutButton({ userName }: Props) {
  const router = useRouter();
  const { isSubmitting, startSubmit, endSubmit } = usePreventDoubleSubmit();
  const [triggerLogout, { isError, error }] = useLogoutMutation();

  const { setWebSocketUser } = useWebSocketClient();

  async function handleLogout() {
    startSubmit();
    setWebSocketUser(null);
    try {
      await triggerLogout().unwrap();
      router.push("/login");
    } catch (e) {
      console.error(e);
      endSubmit();
    }
  }

  const isLong = userName.length > 6; // 긴 닉네임 기준

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        {/* nickname */}
        <div className="overflow-hidden">
          <div className="w-24 text-right">
            {isLong ? (
              <div className="marquee">
                <div className="marquee-inner">
                  <span className="font-bold text-secondary">{userName}</span>
                  <span className="font-bold text-secondary">
                    &nbsp;&nbsp;{userName}
                  </span>
                </div>
              </div>
            ) : (
              <span className="block truncate font-bold text-secondary">
                {userName}
              </span>
            )}
          </div>
        </div>

        {/* logout */}
        <button
          onClick={handleLogout}
          disabled={isSubmitting}
          className="text-sm text-text-muted transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          Logout
        </button>
      </div>

      {isError && (
        <p className="mt-1 text-sm text-error">{getRTKErrorMessage(error)}</p>
      )}
    </div>
  );
}
