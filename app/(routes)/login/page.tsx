import LoginForm from "./_client/LoginForm";

export default function LoginPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-sm bg-surface rounded-xl shadow-lg bg-bg-surface border border-border p-6">
        <h1 className="text-xl font-semibold text-text-main mb-2">
          dvmbr Chat
        </h1>
        <p className="text-sm text-text-muted mb-6">
          닉네임만 입력하면 바로 채팅을 시작할 수 있습니다.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
