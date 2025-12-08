"use client";

import {useGlobalLoading} from "@/app/components/providers/GlobalLoadingProvider";
import {usePreventDoubleSubmit} from "@/app/hooks/usePreventDoubleSubmit";
import {useLogoutMutation} from "@/app/redux/features/authApi";
import {getRtkErrorMessage} from "@/app/redux/utils/getRtkErrorMessage";
import {useRouter} from "next/navigation";

type Props = {
  userName: string;
};

export default function LogoutButton({userName}: Props) {
  const router = useRouter();
  const {isSubmitting, startSubmit, endSubmit} = usePreventDoubleSubmit();
  const {showGlobalLoading, hideGlobalLoading} = useGlobalLoading();
  const [triggerLogout, {isError, error}] = useLogoutMutation();

  async function handleLogout() {
    showGlobalLoading();
    startSubmit();
    try {
      await triggerLogout().unwrap();
      router.push("/login");
    } catch (e) {
      console.error(e);
      endSubmit();
      hideGlobalLoading();
    }
  }

  const isLong = userName.length > 10; // 긴 닉네임 기준

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="overflow-hidden bg-bg-tertiary text-center">
          {/* 닉네임 영역 */}
          <div className="w-24">
            {isLong ? (
              <div className="marquee">
                <div className="marquee-inner">
                  <span className="text-brand-mint font-bold">{userName}</span>
                  <span className="text-brand-mint font-bold">
                    &nbsp;&nbsp;{userName}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-brand-mint font-bold block truncate">
                {userName}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isSubmitting}
          className="text-red-400 hover:text-red-500 text-sm disabled:cursor-not-allowed"
        >
          Logout
        </button>
      </div>
      {isError && (
        <p className="text-sm text-error">{getRtkErrorMessage(error)}</p>
      )}
    </div>
  );
}
