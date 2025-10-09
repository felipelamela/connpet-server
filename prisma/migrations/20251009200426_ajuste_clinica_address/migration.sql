-- DropForeignKey
ALTER TABLE "public"."veterinary_clinics" DROP CONSTRAINT "veterinary_clinics_addressId_fkey";

-- AlterTable
ALTER TABLE "veterinary_clinics" ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "veterinary_clinics" ADD CONSTRAINT "veterinary_clinics_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
