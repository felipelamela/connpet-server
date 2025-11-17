/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `NotesPet` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "NotesPet" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "deletedAt";
