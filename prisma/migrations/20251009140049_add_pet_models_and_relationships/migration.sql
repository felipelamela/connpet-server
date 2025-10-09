/*
  Warnings:

  - Added the required column `jumper` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jumper" INTEGER NOT NULL;
