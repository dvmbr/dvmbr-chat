export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
        <p className="text-sm text-white">Loading login page...</p>
      </div>
    </div>
  );
}
