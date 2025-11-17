/*
  Warnings:

  - Changed the type of `species` on the `ClinicVaccine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `species` on the `Pet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ClinicVaccine" DROP COLUMN "species",
ADD COLUMN     "species" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "species",
ADD COLUMN     "species" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."SpeciesEnum";
