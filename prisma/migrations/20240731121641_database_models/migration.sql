/*
  Warnings:

  - Added the required column `isActive` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AdministratorAdditionalData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AdministratorAdditionalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
)

-- CreateTable
CREATE TABLE "StudentAdditionalData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "gender" TEXT,
    "phone" TEXT,
    "birthDate" DATETIME,
    "height" REAL,
    "weight" REAL,
    "bf" REAL,
    "comorbidity" TEXT,
    "assignedInstructorId" TEXT,
    "status" TEXT,
    "paymentDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "planType" INTEGER NOT NULL,
    "photo" BLOB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentAdditionalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentAdditionalData_assignedInstructorId_fkey" FOREIGN KEY ("assignedInstructorId") REFERENCES "InstructorAdditionalData" ("id") ON DELETE SET NULL ON UPDATE CASCADE
)

-- CreateTable
CREATE TABLE "InstructorAdditionalData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "cref" TEXT,
    "photo" BLOB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InstructorAdditionalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
)

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "acquisitionDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
)

-- CreateTable
CREATE TABLE "StudentEvolution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "height" REAL,
    "weight" REAL,
    "bf" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentEvolution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
)

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "method" TEXT NOT NULL,
    "paymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planType" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
)

-- CreateTable
CREATE TABLE "PaymentHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentHistory_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
)

-- RedefineTables
PRAGMA foreign_keys=OFF
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "cpf" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isActive" INTEGER NOT NULL,
    "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false
)
INSERT INTO "new_User" ("email", "emailVerified", "id", "image", "isTwoFactorEnabled", "name", "password", "role") SELECT "email", "emailVerified", "id", "image", "isTwoFactorEnabled", "name", "password", "role" FROM "User"
DROP TABLE "User"
ALTER TABLE "new_User" RENAME TO "User"
CREATE UNIQUE INDEX "User_email_key" ON "User"("email")
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf")
CREATE INDEX "User_role_idx" ON "User"("role")
PRAGMA foreign_key_check
PRAGMA foreign_keys=ON

-- CreateIndex
CREATE INDEX "AdministratorAdditionalData_id_idx" ON "AdministratorAdditionalData"("id")

-- CreateIndex
CREATE INDEX "StudentAdditionalData_id_idx" ON "StudentAdditionalData"("id")

-- CreateIndex
CREATE UNIQUE INDEX "InstructorAdditionalData_cref_key" ON "InstructorAdditionalData"("cref")

-- CreateIndex
CREATE INDEX "InstructorAdditionalData_id_idx" ON "InstructorAdditionalData"("id")

-- CreateIndex
CREATE UNIQUE INDEX "Machine_serialNumber_key" ON "Machine"("serialNumber")

-- CreateIndex
CREATE INDEX "Machine_id_idx" ON "Machine"("id")

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId")

-- CreateIndex
CREATE INDEX "PaymentHistory_paymentId_idx" ON "PaymentHistory"("paymentId")

-- CreateIndex
CREATE INDEX "PaymentHistory_userId_idx" ON "PaymentHistory"("userId")
