export default function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-bg-surface px-4 py-3">
      {/* avatar placeholder */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevate">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-text-muted/30 border-t-secondary" />
      </div>

      <div className="flex-1">
        <div className="mb-2 h-4 w-32 rounded bg-bg-elevate" />
        <div className="h-3 w-48 rounded bg-bg-elevate" />
      </div>
    </div>
  );
}
