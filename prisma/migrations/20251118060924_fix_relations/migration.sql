/*
  Warnings:

  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - Added the required column `text` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Message_roomId_createdAt_idx";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "content",
ADD COLUMN     "text" TEXT NOT NULL;
