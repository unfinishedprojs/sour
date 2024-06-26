/*
  Warnings:

  - You are about to drop the column `invite` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discordId]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inviteString]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteString` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invite" DROP CONSTRAINT "Invite_discordId_fkey";

-- DropIndex
DROP INDEX "User_invite_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "invite",
ADD COLUMN     "inviteString" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invite_discordId_key" ON "Invite"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_inviteString_key" ON "User"("inviteString");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_inviteString_fkey" FOREIGN KEY ("inviteString") REFERENCES "Invite"("invite") ON DELETE RESTRICT ON UPDATE CASCADE;
