import NicknameGate from "@/components/NicknameGate";
import ParticipantEntry from "@/components/ParticipantEntry";

export default function Home() {
  return (
    <div className="relative">
      <NicknameGate>
        <ParticipantEntry />
      </NicknameGate>
    </div>
  );
}
