-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StudentAdditionalData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "assignedInstructorId" TEXT,
    "name" TEXT,
    "gender" TEXT,
    "phone" TEXT,
    "birthDate" DATETIME,
    "height" REAL,
    "weight" REAL,
    "bf" REAL,
    "comorbidity" TEXT,
    "status" TEXT,
    "paymentDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "planType" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "trainingId" TEXT,
    CONSTRAINT "StudentAdditionalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentAdditionalData_assignedInstructorId_fkey" FOREIGN KEY ("assignedInstructorId") REFERENCES "InstructorAdditionalData" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "StudentAdditionalData_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_StudentAdditionalData" ("assignedInstructorId", "bf", "birthDate", "comorbidity", "createdAt", "gender", "height", "id", "name", "paymentDate", "phone", "planType", "status", "trainingId", "updatedAt", "userId", "weight") SELECT "assignedInstructorId", "bf", "birthDate", "comorbidity", "createdAt", "gender", "height", "id", "name", "paymentDate", "phone", "planType", "status", "trainingId", "updatedAt", "userId", "weight" FROM "StudentAdditionalData";
DROP TABLE "StudentAdditionalData";
ALTER TABLE "new_StudentAdditionalData" RENAME TO "StudentAdditionalData";
CREATE UNIQUE INDEX "StudentAdditionalData_userId_key" ON "StudentAdditionalData"("userId");
CREATE UNIQUE INDEX "StudentAdditionalData_trainingId_key" ON "StudentAdditionalData"("trainingId");
CREATE INDEX "StudentAdditionalData_id_idx" ON "StudentAdditionalData"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
