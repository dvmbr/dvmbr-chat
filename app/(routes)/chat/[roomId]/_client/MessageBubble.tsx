import { MessageVM } from "../_server/MessageVM";

type Props = {
  meId: string;
  message: MessageVM;
};

export default function MessageBubble({ meId, message }: Props) {
  const isMine = meId === message.userId;
  const timeLabel = new Date(message.createdAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-end gap-2 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      {isMine && (
        <span className="whitespace-nowrap text-[11px] text-text-muted">
          {timeLabel}
        </span>
      )}

      <div className="flex max-w-[78%] flex-col">
        {!isMine && (
          <p className="mb-1 text-xs text-text-muted">
            {message.userName ?? "알 수 없는 사용자"}
          </p>
        )}

        <div
          className={`whitespace-pre-wrap break-all border px-3 py-2 text-sm leading-relaxed
            ${
              message.isFailed
                ? "rounded-2xl rounded-br-sm border-error bg-error/10 text-error"
                : isMine
                ? "rounded-2xl rounded-br-sm border-transparent bg-secondary text-bg-deep"
                : "rounded-2xl rounded-bl-sm border-border bg-bg-surface text-text-main"
            }
              ${message.isPending ? "opacity-70" : ""}
            `}
        >
          {message.text}
        </div>
      </div>

      {!isMine && (
        <span className="whitespace-nowrap text-[11px] text-text-muted">
          {timeLabel}
        </span>
      )}
    </div>
  );
}
