/*
  Warnings:

  - You are about to drop the `_PaymentItemToService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_PaymentItemToService" DROP CONSTRAINT "_PaymentItemToService_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PaymentItemToService" DROP CONSTRAINT "_PaymentItemToService_B_fkey";

-- DropIndex
DROP INDEX "public"."Pet_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Pet_tutorId_createdAt_idx";

-- DropIndex
DROP INDEX "public"."UserProfileTutor_phone_idx";

-- DropIndex
DROP INDEX "public"."Vaccination_applicationDate_idx";

-- DropIndex
DROP INDEX "public"."Vaccination_companyId_idx";

-- DropIndex
DROP INDEX "public"."Vaccination_nextDoseDate_idx";

-- DropIndex
DROP INDEX "public"."Vaccination_petId_idx";

-- DropTable
DROP TABLE "public"."_PaymentItemToService";

-- CreateTable
CREATE TABLE "PetCompany" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PetCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PetCompany_petId_idx" ON "PetCompany"("petId");

-- CreateIndex
CREATE INDEX "PetCompany_panelId_idx" ON "PetCompany"("panelId");

-- AddForeignKey
ALTER TABLE "PetCompany" ADD CONSTRAINT "PetCompany_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetCompany" ADD CONSTRAINT "PetCompany_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
