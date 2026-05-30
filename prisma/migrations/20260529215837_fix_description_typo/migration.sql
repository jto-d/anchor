/*
  Warnings:

  - You are about to drop the column `descriptiion` on the `PerkCredit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PerkCredit" DROP COLUMN "descriptiion",
ADD COLUMN     "description" TEXT;
