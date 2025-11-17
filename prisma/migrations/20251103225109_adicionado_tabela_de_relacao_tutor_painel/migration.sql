-- CreateTable
CREATE TABLE "TutorCompany" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TutorCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TutorCompany_tutorId_idx" ON "TutorCompany"("tutorId");

-- CreateIndex
CREATE INDEX "TutorCompany_panelId_idx" ON "TutorCompany"("panelId");

-- AddForeignKey
ALTER TABLE "TutorCompany" ADD CONSTRAINT "TutorCompany_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "UserProfileTutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorCompany" ADD CONSTRAINT "TutorCompany_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
