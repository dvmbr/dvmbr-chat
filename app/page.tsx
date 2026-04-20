import NicknameGate from "@/components/NicknameGate";
import ChatEntry from "@/components/ChatEntry";

export default function Home() {
  return (
    <div className="relative h-full">
      <NicknameGate>
        <ChatEntry />
      </NicknameGate>
    </div>
  );
}
