-- CreateEnum
CREATE TYPE "ResetType" AS ENUM ('CALENDAR', 'ANNIVERSARY');

-- AlterEnum
ALTER TYPE "PerkPeriod" ADD VALUE 'QUADRENNIAL';

-- AlterTable
ALTER TABLE "Perk" ADD COLUMN     "enrollmentRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resetType" "ResetType" NOT NULL DEFAULT 'CALENDAR';
