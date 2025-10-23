/*
  Warnings:

  - You are about to drop the column `crmv` on the `VeterinaryClinic` table. All the data in the column will be lost.
  - You are about to drop the column `crmvState` on the `VeterinaryClinic` table. All the data in the column will be lost.
  - You are about to drop the column `municipalRegistration` on the `VeterinaryClinic` table. All the data in the column will be lost.
  - You are about to drop the column `socialNumber` on the `VeterinaryClinic` table. All the data in the column will be lost.
  - You are about to drop the column `stateRegistration` on the `VeterinaryClinic` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `VeterinaryClinic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnpj` to the `VeterinaryClinic` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."VeterinaryClinic_socialNumber_key";

-- AlterTable
ALTER TABLE "VeterinaryClinic" DROP COLUMN "crmv",
DROP COLUMN "crmvState",
DROP COLUMN "municipalRegistration",
DROP COLUMN "socialNumber",
DROP COLUMN "stateRegistration",
ADD COLUMN     "cnpj" VARCHAR(14) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VeterinaryClinic_cnpj_key" ON "VeterinaryClinic"("cnpj");
