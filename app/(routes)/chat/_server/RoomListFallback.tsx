export default function RoomListFallback() {
  return (
    <div className="px-4 pb-4 flex-1 overflow-y-auto">
      <div className="bg-surface border border-surface-border rounded-lg p-4">
        <p className="text-text-secondary text-sm">채팅방 생성중</p>
      </div>
    </div>
  );
}
