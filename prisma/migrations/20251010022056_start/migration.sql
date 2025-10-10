-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "document" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "role" INTEGER NOT NULL,
    "jumper" INTEGER NOT NULL,
    "veterinaryClinicId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" UUID NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "complement" VARCHAR(255),
    "neighborhood" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" INTEGER NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'Brasil',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VeterinaryClinic" (
    "id" UUID NOT NULL,
    "socialNumber" VARCHAR(14) NOT NULL,
    "socialName" VARCHAR(255) NOT NULL,
    "tradeName" VARCHAR(255),
    "stateRegistration" VARCHAR(20),
    "municipalRegistration" VARCHAR(20),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15),
    "cellphone" VARCHAR(15),
    "crmv" VARCHAR(20),
    "crmvState" INTEGER,
    "technicalManager" VARCHAR(255),
    "managerCrmv" VARCHAR(20),
    "openingTime" VARCHAR(5),
    "closingTime" VARCHAR(5),
    "emergencyService" BOOLEAN DEFAULT false,
    "observations" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "addressId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VeterinaryClinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "species" VARCHAR(50) NOT NULL,
    "breed" INTEGER NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "birthDate" TIMESTAMP(3),
    "color" VARCHAR(50),
    "weight" DOUBLE PRECISION,
    "microchipNumber" VARCHAR(15),
    "observations" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetUser" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PetUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "billingPeriod" TEXT NOT NULL DEFAULT 'MONTHLY',
    "maxUsers" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicPlan" (
    "id" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "veterinaryClinicId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VeterinaryClinic_socialNumber_key" ON "VeterinaryClinic"("socialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_microchipNumber_key" ON "Pet"("microchipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PetUser_userId_petId_key" ON "PetUser"("userId", "petId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicPlan_veterinaryClinicId_planId_key" ON "ClinicPlan"("veterinaryClinicId", "planId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_veterinaryClinicId_fkey" FOREIGN KEY ("veterinaryClinicId") REFERENCES "VeterinaryClinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VeterinaryClinic" ADD CONSTRAINT "VeterinaryClinic_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetUser" ADD CONSTRAINT "PetUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetUser" ADD CONSTRAINT "PetUser_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicPlan" ADD CONSTRAINT "ClinicPlan_veterinaryClinicId_fkey" FOREIGN KEY ("veterinaryClinicId") REFERENCES "VeterinaryClinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicPlan" ADD CONSTRAINT "ClinicPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
