-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserType" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Invite" (
    "invite" TEXT NOT NULL,
    "discordId" TEXT,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("invite")
);

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_discordId_fkey" FOREIGN KEY ("discordId") REFERENCES "User"("discordId") ON DELETE SET NULL ON UPDATE CASCADE;
