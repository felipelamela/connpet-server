/*
  Warnings:

  - You are about to drop the column `companyId` on the `PaymentOrder` table. All the data in the column will be lost.
  - Added the required column `panelId` to the `PaymentOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PaymentOrder" DROP CONSTRAINT "PaymentOrder_companyId_fkey";

-- DropIndex
DROP INDEX "public"."PaymentOrder_companyId_idx";

-- AlterTable
ALTER TABLE "PaymentOrder" DROP COLUMN "companyId",
ADD COLUMN     "panelId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "PaymentOrder_panelId_idx" ON "PaymentOrder"("panelId");

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
