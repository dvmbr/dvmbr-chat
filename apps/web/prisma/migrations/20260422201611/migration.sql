-- DropIndex
DROP INDEX "Room_name_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastRoomId" INTEGER;

-- CreateIndex
CREATE INDEX "Message_participantId_idx" ON "Message"("participantId");

-- CreateIndex
CREATE INDEX "Participant_userId_idx" ON "Participant"("userId");

-- CreateIndex
CREATE INDEX "Participant_roomId_idx" ON "Participant"("roomId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lastRoomId_fkey" FOREIGN KEY ("lastRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
