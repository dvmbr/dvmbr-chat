/*
  Warnings:

  - A unique constraint covering the columns `[browserToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `browserToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "browserToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_browserToken_key" ON "User"("browserToken");
