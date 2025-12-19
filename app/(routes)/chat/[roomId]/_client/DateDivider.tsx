function formatDateLabel(date: Date) {
  const today = new Date();

  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) return "오늘";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}.${m}.${d}`;
}

export default function DateDivider({ date }: { date: Date }) {
  return (
    <div className="my-4 flex items-center">
      <div className="flex-1 border-t border-border" />
      <span className="mx-3 whitespace-nowrap text-xs text-text-muted">
        {formatDateLabel(date)}
      </span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}
