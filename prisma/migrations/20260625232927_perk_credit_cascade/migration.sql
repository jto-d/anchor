-- DropForeignKey
ALTER TABLE "PerkCredit" DROP CONSTRAINT "PerkCredit_perkId_fkey";

-- AddForeignKey
ALTER TABLE "PerkCredit" ADD CONSTRAINT "PerkCredit_perkId_fkey" FOREIGN KEY ("perkId") REFERENCES "Perk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
