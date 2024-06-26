-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PollType" AS ENUM ('inviteUser', 'kickUser', 'customText');

-- CreateTable
CREATE TABLE "User" (
    "discordId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "invite" TEXT NOT NULL,
    "discordUser" TEXT NOT NULL,
    "discordSlug" TEXT NOT NULL,
    "discordProfilePicture" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("discordId")
);

-- CreateTable
CREATE TABLE "Poll" (
    "pollId" SERIAL NOT NULL,
    "type" "PollType" NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[] DEFAULT ARRAY['Yes', 'No']::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("pollId")
);

-- CreateTable
CREATE TABLE "Vote" (
    "userId" TEXT NOT NULL,
    "pollId" INTEGER NOT NULL,
    "option" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("userId","pollId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_invite_key" ON "User"("invite");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("discordId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "Poll"("pollId") ON DELETE RESTRICT ON UPDATE CASCADE;
