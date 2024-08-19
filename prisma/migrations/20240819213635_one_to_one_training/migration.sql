-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Training" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "Training_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "InstructorAdditionalData" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Training_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Training" ("createdAt", "id", "instructorId", "studentId", "updatedAt", "userId") SELECT "createdAt", "id", "instructorId", "studentId", "updatedAt", "userId" FROM "Training";
DROP TABLE "Training";
ALTER TABLE "new_Training" RENAME TO "Training";
CREATE UNIQUE INDEX "Training_studentId_key" ON "Training"("studentId");
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
    CONSTRAINT "StudentAdditionalData_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StudentAdditionalData" ("assignedInstructorId", "bf", "birthDate", "comorbidity", "createdAt", "gender", "height", "id", "name", "paymentDate", "phone", "planType", "status", "updatedAt", "userId", "weight") SELECT "assignedInstructorId", "bf", "birthDate", "comorbidity", "createdAt", "gender", "height", "id", "name", "paymentDate", "phone", "planType", "status", "updatedAt", "userId", "weight" FROM "StudentAdditionalData";
DROP TABLE "StudentAdditionalData";
ALTER TABLE "new_StudentAdditionalData" RENAME TO "StudentAdditionalData";
CREATE UNIQUE INDEX "StudentAdditionalData_userId_key" ON "StudentAdditionalData"("userId");
CREATE UNIQUE INDEX "StudentAdditionalData_trainingId_key" ON "StudentAdditionalData"("trainingId");
CREATE INDEX "StudentAdditionalData_id_idx" ON "StudentAdditionalData"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
