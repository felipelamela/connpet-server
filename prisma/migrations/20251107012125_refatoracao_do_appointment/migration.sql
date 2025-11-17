/*
  Warnings:

  - You are about to drop the column `companyId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `panelId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeSpecialty` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentOrderId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_paymentOrderId_fkey";

-- DropIndex
DROP INDEX "public"."Appointment_companyId_idx";

-- DropIndex
DROP INDEX "public"."Product_companyId_name_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "companyId",
ADD COLUMN     "panelId" TEXT NOT NULL,
ADD COLUMN     "typeSpecialty" INTEGER NOT NULL,
ADD COLUMN     "vetId" TEXT,
ALTER COLUMN "paymentOrderId" SET NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Grooming" (
    "id" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "paymentOrderId" TEXT,
    "status" "InternationStatusEnum" NOT NULL DEFAULT 'IN_PROGRESS',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grooming_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Selling" (
    "id" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "paymentOrderId" TEXT,
    "status" "InternationStatusEnum" NOT NULL DEFAULT 'IN_PROGRESS',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Selling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostingPet" (
    "id" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "paymentOrderId" TEXT,
    "status" "InternationStatusEnum" NOT NULL DEFAULT 'IN_PROGRESS',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostingPet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Grooming_petId_idx" ON "Grooming"("petId");

-- CreateIndex
CREATE INDEX "Grooming_panelId_idx" ON "Grooming"("panelId");

-- CreateIndex
CREATE INDEX "Grooming_status_idx" ON "Grooming"("status");

-- CreateIndex
CREATE INDEX "Grooming_startDate_idx" ON "Grooming"("startDate");

-- CreateIndex
CREATE INDEX "Selling_panelId_idx" ON "Selling"("panelId");

-- CreateIndex
CREATE INDEX "Selling_status_idx" ON "Selling"("status");

-- CreateIndex
CREATE INDEX "Selling_startDate_idx" ON "Selling"("startDate");

-- CreateIndex
CREATE INDEX "HostingPet_panelId_idx" ON "HostingPet"("panelId");

-- CreateIndex
CREATE INDEX "HostingPet_status_idx" ON "HostingPet"("status");

-- CreateIndex
CREATE INDEX "HostingPet_startDate_idx" ON "HostingPet"("startDate");

-- CreateIndex
CREATE INDEX "Appointment_panelId_idx" ON "Appointment"("panelId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "UserProfileEmployee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grooming" ADD CONSTRAINT "Grooming_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grooming" ADD CONSTRAINT "Grooming_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grooming" ADD CONSTRAINT "Grooming_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Selling" ADD CONSTRAINT "Selling_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Selling" ADD CONSTRAINT "Selling_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "UserProfileTutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Selling" ADD CONSTRAINT "Selling_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostingPet" ADD CONSTRAINT "HostingPet_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostingPet" ADD CONSTRAINT "HostingPet_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostingPet" ADD CONSTRAINT "HostingPet_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostingPet" ADD CONSTRAINT "HostingPet_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "UserProfileTutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
