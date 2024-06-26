/*
  Warnings:

  - You are about to drop the column `data` on the `Poll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "data",
ADD COLUMN     "extraData" JSONB;
