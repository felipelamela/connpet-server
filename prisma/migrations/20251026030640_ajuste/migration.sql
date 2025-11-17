/*
  Warnings:

  - You are about to drop the column `expirationDate` on the `ClinicVaccine` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ClinicVaccine` table. All the data in the column will be lost.
  - You are about to drop the column `productBatchId` on the `ClinicVaccine` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ClinicVaccine` table. All the data in the column will be lost.
  - You are about to drop the column `vaccineTypeId` on the `ClinicVaccine` table. All the data in the column will be lost.
  - You are about to drop the column `productBatchId` on the `Medication` table. All the data in the column will be lost.
  - You are about to drop the column `productBatchId` on the `PaymentItem` table. All the data in the column will be lost.
  - You are about to drop the `ProductBatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VaccineType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clinicId,productId]` on the table `ClinicVaccine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `ClinicVaccine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `species` to the `ClinicVaccine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Medication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePay` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceSale` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ClinicVaccine" DROP CONSTRAINT "ClinicVaccine_productBatchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClinicVaccine" DROP CONSTRAINT "ClinicVaccine_vaccineTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Medication" DROP CONSTRAINT "Medication_productBatchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentItem" DROP CONSTRAINT "PaymentItem_productBatchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductBatch" DROP CONSTRAINT "ProductBatch_productId_fkey";

-- DropIndex
DROP INDEX "public"."ClinicVaccine_clinicId_vaccineTypeId_productBatchId_key";

-- DropIndex
DROP INDEX "public"."ClinicVaccine_vaccineTypeId_idx";

-- DropIndex
DROP INDEX "public"."PaymentItem_productBatchId_idx";

-- AlterTable
ALTER TABLE "ClinicVaccine" DROP COLUMN "expirationDate",
DROP COLUMN "price",
DROP COLUMN "productBatchId",
DROP COLUMN "quantity",
DROP COLUMN "vaccineTypeId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "species" "SpeciesEnum" NOT NULL;

-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "productBatchId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaymentItem" DROP COLUMN "productBatchId",
ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "batchNumber" TEXT,
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "manufacturer" TEXT,
ADD COLUMN     "pricePay" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "priceSale" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."ProductBatch";

-- DropTable
DROP TABLE "public"."VaccineType";

-- CreateIndex
CREATE UNIQUE INDEX "ClinicVaccine_clinicId_productId_key" ON "ClinicVaccine"("clinicId", "productId");

-- CreateIndex
CREATE INDEX "PaymentItem_productId_idx" ON "PaymentItem"("productId");

-- CreateIndex
CREATE INDEX "Product_expirationDate_idx" ON "Product"("expirationDate");

-- AddForeignKey
ALTER TABLE "ClinicVaccine" ADD CONSTRAINT "ClinicVaccine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
