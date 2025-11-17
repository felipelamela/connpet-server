-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('ADMIN', 'CLINIC_ADMIN', 'CLINIC_VET', 'CLINIC_STAFF', 'CLINIC_RECEPTIONIST');

-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "AppointmentStatusEnum" AS ENUM ('PENDING', 'CONFIRMED', 'INPROCESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentOriginEnum" AS ENUM ('CLINIC', 'PETSHOP');

-- CreateEnum
CREATE TYPE "StateEnum" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('MEDICINE', 'TOY', 'FOOD', 'HYGIENE', 'ACCESSORY');

-- CreateEnum
CREATE TYPE "SpeciesEnum" AS ENUM ('DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'GUINEA_PIG', 'FERRET', 'REPTILE', 'FISH', 'OTHER');

-- CreateEnum
CREATE TYPE "PanelTypeEnum" AS ENUM ('CLINIC', 'PETSHOP', 'GROOMING');

-- CreateEnum
CREATE TYPE "InternationStatusEnum" AS ENUM ('IN_PROGRESS', 'DISCHARGED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "cep" VARCHAR(8) NOT NULL,
    "street" TEXT NOT NULL,
    "number" VARCHAR(10) NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" "StateEnum" NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Brasil',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "socialName" TEXT NOT NULL,
    "tradeName" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "addressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfileEmployee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "document" TEXT,
    "crmv" TEXT,
    "crmvState" "StateEnum",
    "phone" TEXT,
    "roles" "RoleEnum" NOT NULL,
    "addressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfileEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfileTutor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "document" TEXT,
    "phone" TEXT,
    "addressId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfileTutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" "SpeciesEnum" NOT NULL,
    "breed" INTEGER NOT NULL,
    "birthDate" TIMESTAMP(3),
    "color" TEXT,
    "weight" DECIMAL(65,30),
    "microchipNumber" TEXT,
    "observations" TEXT,
    "gender" "GenderEnum" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotesPet" (
    "id" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "NotesPet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Panel" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "type" "PanelTypeEnum" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "openingTime" TIMESTAMP(3),
    "closingTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Panel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicPlan" (
    "id" TEXT NOT NULL,
    "panelId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "billingPeriod" INTEGER NOT NULL DEFAULT 3,
    "maxUsers" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ProductType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductBatch" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "batchNumber" TEXT,
    "manufacturer" TEXT,
    "quantity" INTEGER NOT NULL,
    "pricePay" DECIMAL(65,30) NOT NULL,
    "priceSale" DECIMAL(65,30) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "validatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaccineType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "species" "SpeciesEnum" NOT NULL,
    "dosesRequired" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VaccineType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicVaccine" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "vaccineTypeId" TEXT NOT NULL,
    "productBatchId" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClinicVaccine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "clinicVaccineId" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "nextDoseDate" TIMESTAMP(3),
    "doseNumber" INTEGER NOT NULL DEFAULT 1,
    "adverseReaction" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "paymentOrderId" TEXT,
    "status" "AppointmentStatusEnum" NOT NULL DEFAULT 'PENDING',
    "type" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Internation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "paymentOrderId" TEXT,
    "responsibleVetId" TEXT,
    "room" TEXT,
    "status" "InternationStatusEnum" NOT NULL DEFAULT 'IN_PROGRESS',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Internation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "internationId" TEXT,
    "prescribedByVetId" TEXT,
    "productBatchId" TEXT NOT NULL,
    "dosage" TEXT,
    "dosageUnit" TEXT,
    "frequency" TEXT,
    "administrationRoute" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "lastDosage" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentOrder" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "originType" "PaymentOriginEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentItem" (
    "id" TEXT NOT NULL,
    "paymentOrderId" TEXT NOT NULL,
    "productBatchId" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "requestedByVetId" TEXT,
    "requestedByCompanyId" TEXT,
    "appointmentId" TEXT,
    "internationId" TEXT,
    "paymentOrderId" TEXT,
    "name" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "clinicId" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultExam" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "issuedByVetId" TEXT,
    "issuedByCompanyId" TEXT,
    "clinicId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultExam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");

-- CreateIndex
CREATE INDEX "Company_cnpj_idx" ON "Company"("cnpj");

-- CreateIndex
CREATE INDEX "Company_email_idx" ON "Company"("email");

-- CreateIndex
CREATE INDEX "Company_createdAt_idx" ON "Company"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "UserProfileEmployee_userId_idx" ON "UserProfileEmployee"("userId");

-- CreateIndex
CREATE INDEX "UserProfileEmployee_companyId_idx" ON "UserProfileEmployee"("companyId");

-- CreateIndex
CREATE INDEX "UserProfileEmployee_roles_idx" ON "UserProfileEmployee"("roles");

-- CreateIndex
CREATE INDEX "UserProfileEmployee_crmv_idx" ON "UserProfileEmployee"("crmv");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfileTutor_userId_key" ON "UserProfileTutor"("userId");

-- CreateIndex
CREATE INDEX "UserProfileTutor_userId_idx" ON "UserProfileTutor"("userId");

-- CreateIndex
CREATE INDEX "UserProfileTutor_document_idx" ON "UserProfileTutor"("document");

-- CreateIndex
CREATE INDEX "UserProfileTutor_phone_idx" ON "UserProfileTutor"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_microchipNumber_key" ON "Pet"("microchipNumber");

-- CreateIndex
CREATE INDEX "Pet_tutorId_idx" ON "Pet"("tutorId");

-- CreateIndex
CREATE INDEX "Pet_active_idx" ON "Pet"("active");

-- CreateIndex
CREATE INDEX "Pet_name_idx" ON "Pet"("name");

-- CreateIndex
CREATE INDEX "Pet_createdAt_idx" ON "Pet"("createdAt");

-- CreateIndex
CREATE INDEX "Pet_tutorId_createdAt_idx" ON "Pet"("tutorId", "createdAt");

-- CreateIndex
CREATE INDEX "NotesPet_petId_idx" ON "NotesPet"("petId");

-- CreateIndex
CREATE INDEX "NotesPet_tutorId_idx" ON "NotesPet"("tutorId");

-- CreateIndex
CREATE INDEX "NotesPet_createdAt_idx" ON "NotesPet"("createdAt");

-- CreateIndex
CREATE INDEX "Plan_active_idx" ON "Plan"("active");

-- CreateIndex
CREATE INDEX "Panel_companyId_idx" ON "Panel"("companyId");

-- CreateIndex
CREATE INDEX "Panel_type_idx" ON "Panel"("type");

-- CreateIndex
CREATE INDEX "ClinicPlan_panelId_idx" ON "ClinicPlan"("panelId");

-- CreateIndex
CREATE INDEX "ClinicPlan_planId_idx" ON "ClinicPlan"("planId");

-- CreateIndex
CREATE INDEX "Product_companyId_idx" ON "Product"("companyId");

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "Product"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Product_companyId_name_key" ON "Product"("companyId", "name");

-- CreateIndex
CREATE INDEX "ProductBatch_productId_idx" ON "ProductBatch"("productId");

-- CreateIndex
CREATE INDEX "ProductBatch_expirationDate_idx" ON "ProductBatch"("expirationDate");

-- CreateIndex
CREATE INDEX "ClinicVaccine_clinicId_idx" ON "ClinicVaccine"("clinicId");

-- CreateIndex
CREATE INDEX "ClinicVaccine_vaccineTypeId_idx" ON "ClinicVaccine"("vaccineTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicVaccine_clinicId_vaccineTypeId_productBatchId_key" ON "ClinicVaccine"("clinicId", "vaccineTypeId", "productBatchId");

-- CreateIndex
CREATE INDEX "Vaccination_petId_idx" ON "Vaccination"("petId");

-- CreateIndex
CREATE INDEX "Vaccination_companyId_idx" ON "Vaccination"("companyId");

-- CreateIndex
CREATE INDEX "Vaccination_applicationDate_idx" ON "Vaccination"("applicationDate");

-- CreateIndex
CREATE INDEX "Vaccination_nextDoseDate_idx" ON "Vaccination"("nextDoseDate");

-- CreateIndex
CREATE INDEX "Appointment_petId_idx" ON "Appointment"("petId");

-- CreateIndex
CREATE INDEX "Appointment_companyId_idx" ON "Appointment"("companyId");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "Appointment_scheduledAt_idx" ON "Appointment"("scheduledAt");

-- CreateIndex
CREATE INDEX "Internation_petId_idx" ON "Internation"("petId");

-- CreateIndex
CREATE INDEX "Internation_companyId_idx" ON "Internation"("companyId");

-- CreateIndex
CREATE INDEX "Internation_status_idx" ON "Internation"("status");

-- CreateIndex
CREATE INDEX "Internation_startDate_idx" ON "Internation"("startDate");

-- CreateIndex
CREATE INDEX "Medication_petId_idx" ON "Medication"("petId");

-- CreateIndex
CREATE INDEX "Medication_appointmentId_idx" ON "Medication"("appointmentId");

-- CreateIndex
CREATE INDEX "Medication_internationId_idx" ON "Medication"("internationId");

-- CreateIndex
CREATE INDEX "Medication_startDate_endDate_idx" ON "Medication"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "PaymentOrder_companyId_idx" ON "PaymentOrder"("companyId");

-- CreateIndex
CREATE INDEX "PaymentOrder_status_idx" ON "PaymentOrder"("status");

-- CreateIndex
CREATE INDEX "PaymentOrder_createdAt_idx" ON "PaymentOrder"("createdAt");

-- CreateIndex
CREATE INDEX "PaymentItem_paymentOrderId_idx" ON "PaymentItem"("paymentOrderId");

-- CreateIndex
CREATE INDEX "PaymentItem_productBatchId_idx" ON "PaymentItem"("productBatchId");

-- CreateIndex
CREATE INDEX "Exam_petId_idx" ON "Exam"("petId");

-- CreateIndex
CREATE INDEX "Exam_clinicId_idx" ON "Exam"("clinicId");

-- CreateIndex
CREATE INDEX "Exam_examDate_idx" ON "Exam"("examDate");

-- CreateIndex
CREATE INDEX "Exam_requestedByVetId_idx" ON "Exam"("requestedByVetId");

-- CreateIndex
CREATE INDEX "Exam_requestedByCompanyId_idx" ON "Exam"("requestedByCompanyId");

-- CreateIndex
CREATE INDEX "ResultExam_examId_idx" ON "ResultExam"("examId");

-- CreateIndex
CREATE INDEX "ResultExam_clinicId_idx" ON "ResultExam"("clinicId");

-- CreateIndex
CREATE INDEX "ResultExam_createdAt_idx" ON "ResultExam"("createdAt");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileEmployee" ADD CONSTRAINT "UserProfileEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileEmployee" ADD CONSTRAINT "UserProfileEmployee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileEmployee" ADD CONSTRAINT "UserProfileEmployee_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileTutor" ADD CONSTRAINT "UserProfileTutor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileTutor" ADD CONSTRAINT "UserProfileTutor_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "UserProfileTutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotesPet" ADD CONSTRAINT "NotesPet_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "UserProfileTutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotesPet" ADD CONSTRAINT "NotesPet_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panel" ADD CONSTRAINT "Panel_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicPlan" ADD CONSTRAINT "ClinicPlan_panelId_fkey" FOREIGN KEY ("panelId") REFERENCES "Panel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicPlan" ADD CONSTRAINT "ClinicPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductBatch" ADD CONSTRAINT "ProductBatch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicVaccine" ADD CONSTRAINT "ClinicVaccine_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicVaccine" ADD CONSTRAINT "ClinicVaccine_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "VaccineType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicVaccine" ADD CONSTRAINT "ClinicVaccine_productBatchId_fkey" FOREIGN KEY ("productBatchId") REFERENCES "ProductBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_clinicVaccineId_fkey" FOREIGN KEY ("clinicVaccineId") REFERENCES "ClinicVaccine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Internation" ADD CONSTRAINT "Internation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Internation" ADD CONSTRAINT "Internation_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Internation" ADD CONSTRAINT "Internation_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Internation" ADD CONSTRAINT "Internation_responsibleVetId_fkey" FOREIGN KEY ("responsibleVetId") REFERENCES "UserProfileEmployee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_internationId_fkey" FOREIGN KEY ("internationId") REFERENCES "Internation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_prescribedByVetId_fkey" FOREIGN KEY ("prescribedByVetId") REFERENCES "UserProfileEmployee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_productBatchId_fkey" FOREIGN KEY ("productBatchId") REFERENCES "ProductBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentItem" ADD CONSTRAINT "PaymentItem_productBatchId_fkey" FOREIGN KEY ("productBatchId") REFERENCES "ProductBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultExam" ADD CONSTRAINT "ResultExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultExam" ADD CONSTRAINT "ResultExam_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
