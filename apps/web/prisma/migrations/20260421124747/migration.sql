/*
  Warnings:

  - Added the required column `roomId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Message_createdAt_idx";

-- DropIndex
DROP INDEX "Message_participantId_idx";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "roomId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Message_roomId_createdAt_idx" ON "Message"("roomId", "createdAt");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
