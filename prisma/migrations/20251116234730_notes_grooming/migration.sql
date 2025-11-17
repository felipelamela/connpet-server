-- AlterTable
ALTER TABLE "Grooming" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "notesGrooming" (
    "id" TEXT NOT NULL,
    "vetId" TEXT,
    "groomingId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notesGrooming_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notesGrooming" ADD CONSTRAINT "notesGrooming_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "UserProfileEmployee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notesGrooming" ADD CONSTRAINT "notesGrooming_groomingId_fkey" FOREIGN KEY ("groomingId") REFERENCES "Grooming"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
