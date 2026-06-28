-- CreateTable
CREATE TABLE "SplitPartner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SplitPartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitExpense" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "date" TEXT,
    "desc" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payer" TEXT NOT NULL,
    "cat" TEXT NOT NULL,
    "splitYou" INTEGER NOT NULL,
    "splitThem" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SplitExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SplitSettlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "date" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "fromPayer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SplitSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SplitPartner_userId_key" ON "SplitPartner"("userId");

-- AddForeignKey
ALTER TABLE "SplitPartner" ADD CONSTRAINT "SplitPartner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitExpense" ADD CONSTRAINT "SplitExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SplitSettlement" ADD CONSTRAINT "SplitSettlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
