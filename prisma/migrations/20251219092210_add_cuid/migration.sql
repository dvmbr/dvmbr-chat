/*
  Warnings:

  - A unique constraint covering the columns `[roomId,cuid]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cuid` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "cuid" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Message_roomId_createdAt_idx" ON "Message"("roomId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Message_roomId_cuid_key" ON "Message"("roomId", "cuid");
