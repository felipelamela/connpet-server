/*
  Warnings:

  - You are about to alter the column `amount` on the `PaymentOrder` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `weight` on the `Pet` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "PaymentItem" ALTER COLUMN "price" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "PaymentOrder" ALTER COLUMN "amount" SET DEFAULT 0.0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Pet" ALTER COLUMN "weight" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "pricePay" SET DEFAULT 0.0,
ALTER COLUMN "priceSale" SET DEFAULT 0.0;

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "price" SET DEFAULT 0.0,
ALTER COLUMN "commission" SET DEFAULT 0.0,
ALTER COLUMN "commission" SET DATA TYPE DECIMAL(10,2);
