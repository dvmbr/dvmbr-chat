"use client";

type Props = {
  userName: string;
};

export default function LogoutButton({userName}: Props) {
  async function handleLogout() {
    await fetch("/api/logout", {method: "POST"});
    window.location.href = "/login";
  }

  const isLong = userName.length > 10; // 긴 닉네임 기준

  return (
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
        className="text-red-400 hover:text-red-500 text-sm"
      >
        Logout
      </button>
    </div>
  );
}
