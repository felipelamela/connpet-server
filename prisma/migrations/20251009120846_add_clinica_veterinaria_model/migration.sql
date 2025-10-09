-- CreateTable
CREATE TABLE "veterinary_clinics" (
    "id" UUID NOT NULL,
    "socialNumber" VARCHAR(14) NOT NULL,
    "socialName" VARCHAR(255) NOT NULL,
    "tradeName" VARCHAR(255) NOT NULL,
    "stateRegistration" VARCHAR(20),
    "municipalRegistration" VARCHAR(20),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "cellphone" VARCHAR(15),
    "crmv" VARCHAR(20) NOT NULL,
    "crmvState" INTEGER NOT NULL,
    "technicalManager" VARCHAR(255) NOT NULL,
    "managerCrmv" VARCHAR(20) NOT NULL,
    "openingTime" VARCHAR(5),
    "closingTime" VARCHAR(5),
    "emergencyService" BOOLEAN NOT NULL DEFAULT false,
    "observations" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "addressId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veterinary_clinics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "veterinary_clinics_socialNumber_key" ON "veterinary_clinics"("socialNumber");

-- AddForeignKey
ALTER TABLE "veterinary_clinics" ADD CONSTRAINT "veterinary_clinics_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
