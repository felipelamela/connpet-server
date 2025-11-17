/*
  Warnings:

  - You are about to drop the column `closingTime` on the `Panel` table. All the data in the column will be lost.
  - You are about to drop the column `openingTime` on the `Panel` table. All the data in the column will be lost.
  - You are about to drop the `ClinicPlan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ClinicPlan" DROP CONSTRAINT "ClinicPlan_panelId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClinicPlan" DROP CONSTRAINT "ClinicPlan_planId_fkey";

-- AlterTable
ALTER TABLE "Panel" DROP COLUMN "closingTime",
DROP COLUMN "openingTime",
ADD COLUMN     "billingPeriod" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "maxUsers" INTEGER,
ADD COLUMN     "type" "PanelTypeEnum" NOT NULL;

-- DropTable
DROP TABLE "public"."ClinicPlan";
