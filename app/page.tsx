import ChatRoom from "@/components/ChatRoom";
import NicknameGate from "@/components/NicknameGate";

export default function Home() {
  return (
    <div className="relative">
      <NicknameGate />
      <ChatRoom />
    </div>
  );
}
