-- CreateTable
CREATE TABLE "SubscriptionSplitExclusion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionSplitExclusion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionSplitExclusion_subscriptionId_year_month_key" ON "SubscriptionSplitExclusion"("subscriptionId", "year", "month");

-- AddForeignKey
ALTER TABLE "SubscriptionSplitExclusion" ADD CONSTRAINT "SubscriptionSplitExclusion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionSplitExclusion" ADD CONSTRAINT "SubscriptionSplitExclusion_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
