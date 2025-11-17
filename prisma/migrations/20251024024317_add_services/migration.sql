-- CreateEnum
CREATE TYPE "ServiceCategoryEnum" AS ENUM ('CONSULTATION', 'EXAM', 'VACCINE', 'SURGERY', 'HOSPITALIZATION', 'BATH_GROOMING', 'PETSHOP', 'OTHER');

-- AlterTable
ALTER TABLE "PaymentItem" ADD COLUMN     "serviceId" TEXT;

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" "ServiceCategoryEnum" NOT NULL,
    "duration" INTEGER DEFAULT 30,
    "price" DECIMAL(10,2) NOT NULL,
    "commission" DECIMAL(5,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PaymentItemToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PaymentItemToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Service_panelId_idx" ON "Service"("panelId");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "Service"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Service_panelId_name_key" ON "Service"("panelId", "name");

-- CreateIndex
CREATE INDEX "_PaymentItemToService_B_index" ON "_PaymentItemToService"("B");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentItemToService" ADD CONSTRAINT "_PaymentItemToService_A_fkey" FOREIGN KEY ("A") REFERENCES "PaymentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentItemToService" ADD CONSTRAINT "_PaymentItemToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
