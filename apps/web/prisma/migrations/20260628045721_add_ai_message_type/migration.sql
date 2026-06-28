-- AlterEnum
ALTER TYPE "MessageType" ADD VALUE 'AI';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAiBot" BOOLEAN NOT NULL DEFAULT false;
