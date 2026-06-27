-- Fix AccountType enum to match accountData.ts values
ALTER TYPE "AccountType" RENAME TO "AccountType_old";

CREATE TYPE "AccountType" AS ENUM (
  'CHECKING',
  'SAVINGS',
  'MONEY_MARKET',
  'CD',
  'BROKERAGE',
  'FOUR_OH_ONE_K',
  'ROTH_IRA',
  'TRADITIONAL_IRA',
  'HSA',
  'FIVE_TWO_NINE',
  'CRYPTO'
);

-- Account table is empty, so alter the column type directly
ALTER TABLE "Account" ALTER COLUMN "type" TYPE "AccountType" USING "type"::text::"AccountType";

DROP TYPE "AccountType_old";
