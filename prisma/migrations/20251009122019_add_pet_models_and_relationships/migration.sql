-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "veterinaryClinicId" UUID;

-- CreateTable
CREATE TABLE "pets" (
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

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_users" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pets_microchipNumber_key" ON "pets"("microchipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "pet_users_userId_petId_key" ON "pet_users"("userId", "petId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_veterinaryClinicId_fkey" FOREIGN KEY ("veterinaryClinicId") REFERENCES "veterinary_clinics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_users" ADD CONSTRAINT "pet_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_users" ADD CONSTRAINT "pet_users_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
