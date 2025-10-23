/*
  Warnings:

  - You are about to drop the column `billingPeriod` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `maxUsers` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `document` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `jumper` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `veterinaryClinicId` on the `User` table. All the data in the column will be lost.
  - The `crmvState` column on the `VeterinaryClinic` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `PetUser` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `state` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `tutorId` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Pet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('ADMIN', 'CLINIC_ADMIN', 'CLINIC_VET', 'CLINIC_STAFF', 'CLINIC_RECEPTIONIST');

-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "AppointmentStatusEnum" AS ENUM ('PENDING', 'CONFIRMED', 'INPROCESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StateEnum" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('MEDICINE', 'TOY', 'FOOD', 'HYGIENE', 'ACCESSORY');

-- CreateEnum
CREATE TYPE "Usage" AS ENUM ('CLINIC', 'PETSHOP', 'SELL');

-- DropForeignKey
ALTER TABLE "public"."PetUser" DROP CONSTRAINT "PetUser_petId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PetUser" DROP CONSTRAINT "PetUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_veterinaryClinicId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "state",
ADD COLUMN     "state" "StateEnum" NOT NULL;

-- AlterTable
ALTER TABLE "ClinicPlan" ADD COLUMN     "billingPeriod" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "maxUsers" INTEGER;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "tutorId" UUID NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "GenderEnum" NOT NULL;

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "billingPeriod",
DROP COLUMN "maxUsers";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "document",
DROP COLUMN "jumper",
DROP COLUMN "role",
DROP COLUMN "veterinaryClinicId";

-- AlterTable
ALTER TABLE "VeterinaryClinic" DROP COLUMN "crmvState",
ADD COLUMN     "crmvState" "StateEnum";

-- DropTable
DROP TABLE "public"."PetUser";

-- CreateTable
CREATE TABLE "UserProfileEmployee" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "document" VARCHAR(20),
    "phone" VARCHAR(15),
    "roles" "RoleEnum" NOT NULL,
    "addressId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfileEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VeterinarianProfile" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "crmv" VARCHAR(20) NOT NULL,
    "crmvState" "StateEnum" NOT NULL,
    "technicalManager" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VeterinarianProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfileTutor" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "document" VARCHAR(20),
    "phone" VARCHAR(15),
    "addressId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfileTutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "validatedAt" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL,
    "type" "ProductType" NOT NULL,
    "clinicId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductUsage" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "usage" "Usage" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "clinicId" UUID NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentItem" (
    "id" UUID NOT NULL,
    "paymentId" UUID NOT NULL,
    "serviceId" UUID,
    "productId" UUID,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "serviceId" UUID,
    "status" "AppointmentStatusEnum" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "requestedByVetId" UUID,
    "name" VARCHAR(255) NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "clinicId" UUID,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultExam" (
    "id" UUID NOT NULL,
    "examId" UUID NOT NULL,
    "IssuedByVetId" UUID,
    "clinicId" UUID,
    "fileUrl" VARCHAR(255) NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "dosage" VARCHAR(100),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "lastDosege" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfileTutor_userId_key" ON "UserProfileTutor"("userId");

-- AddForeignKey
ALTER TABLE "UserProfileEmployee" ADD CONSTRAINT "UserProfileEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileEmployee" ADD CONSTRAINT "UserProfileEmployee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "VeterinaryClinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileEmployee" ADD CONSTRAINT "UserProfileEmployee_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VeterinarianProfile" ADD CONSTRAINT "VeterinarianProfile_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "UserProfileEmployee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileTutor" ADD CONSTRAINT "UserProfileTutor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileTutor" ADD CONSTRAINT "UserProfileTutor_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "UserProfileTutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "VeterinaryClinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductUsage" ADD CONSTRAINT "ProductUsage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "VeterinaryClinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "VeterinaryClinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "VeterinaryClinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_requestedByVetId_fkey" FOREIGN KEY ("requestedByVetId") REFERENCES "VeterinarianProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "VeterinaryClinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultExam" ADD CONSTRAINT "ResultExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultExam" ADD CONSTRAINT "ResultExam_IssuedByVetId_fkey" FOREIGN KEY ("IssuedByVetId") REFERENCES "VeterinarianProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultExam" ADD CONSTRAINT "ResultExam_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "VeterinaryClinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
