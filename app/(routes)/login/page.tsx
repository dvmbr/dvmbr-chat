import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="h-full flex items-center justify-center text-text-primary">
      <div className="w-full max-w-sm bg-surface rounded-xl shadow-lg border border-surface-border p-6">
        <h1 className="text-xl font-semibold mb-2">dvmbr Chat</h1>
        <p className="text-sm text-text-secondary mb-6">
          닉네임만 입력하면 바로 채팅을 시작할 수 있습니다.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
