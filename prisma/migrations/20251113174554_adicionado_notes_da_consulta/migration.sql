-- CreateTable
CREATE TABLE "notesAppointment" (
    "id" TEXT NOT NULL,
    "vetId" TEXT,
    "appointmentId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notesAppointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notesAppointment" ADD CONSTRAINT "notesAppointment_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "UserProfileEmployee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notesAppointment" ADD CONSTRAINT "notesAppointment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
