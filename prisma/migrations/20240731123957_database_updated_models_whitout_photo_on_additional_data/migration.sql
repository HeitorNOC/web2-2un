/*
  Warnings:

  - You are about to drop the column `photo` on the `StudentAdditionalData` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `InstructorAdditionalData` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF
CREATE TABLE "new_StudentAdditionalData" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentAdditionalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentAdditionalData_assignedInstructorId_fkey" FOREIGN KEY ("assignedInstructorId") REFERENCES "InstructorAdditionalData" ("id") ON DELETE SET NULL ON UPDATE CASCADE
)
INSERT INTO "new_StudentAdditionalData" ("assignedInstructorId", "bf", "birthDate", "comorbidity", "createdAt", "gender", "height", "id", "name", "paymentDate", "phone", "planType", "status", "updatedAt", "userId", "weight") SELECT "assignedInstructorId", "bf", "birthDate", "comorbidity", "createdAt", "gender", "height", "id", "name", "paymentDate", "phone", "planType", "status", "updatedAt", "userId", "weight" FROM "StudentAdditionalData"
DROP TABLE "StudentAdditionalData"
ALTER TABLE "new_StudentAdditionalData" RENAME TO "StudentAdditionalData"
CREATE INDEX "StudentAdditionalData_id_idx" ON "StudentAdditionalData"("id")
CREATE TABLE "new_InstructorAdditionalData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "cref" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InstructorAdditionalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
)
INSERT INTO "new_InstructorAdditionalData" ("createdAt", "cref", "id", "name", "phone", "updatedAt", "userId") SELECT "createdAt", "cref", "id", "name", "phone", "updatedAt", "userId" FROM "InstructorAdditionalData"
DROP TABLE "InstructorAdditionalData"
ALTER TABLE "new_InstructorAdditionalData" RENAME TO "InstructorAdditionalData"
CREATE UNIQUE INDEX "InstructorAdditionalData_cref_key" ON "InstructorAdditionalData"("cref")
CREATE INDEX "InstructorAdditionalData_id_idx" ON "InstructorAdditionalData"("id")
PRAGMA foreign_key_check
PRAGMA foreign_keys=ON
