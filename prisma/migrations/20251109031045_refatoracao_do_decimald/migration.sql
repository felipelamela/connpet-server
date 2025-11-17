/*
  Warnings:

  - You are about to drop the column `price` on the `PaymentItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `PaymentItem` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `Pet` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE "PaymentItem" DROP COLUMN "price",
DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Pet" ALTER COLUMN "weight" SET DATA TYPE DECIMAL(10,3);
