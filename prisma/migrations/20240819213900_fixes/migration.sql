/*
  Warnings:

  - You are about to drop the column `userId` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PaymentHistory` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Training" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Training_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "InstructorAdditionalData" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Training" ("createdAt", "id", "instructorId", "studentId", "updatedAt") SELECT "createdAt", "id", "instructorId", "studentId", "updatedAt" FROM "Training";
DROP TABLE "Training";
ALTER TABLE "new_Training" RENAME TO "Training";
CREATE UNIQUE INDEX "Training_studentId_key" ON "Training"("studentId");
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "method" TEXT NOT NULL,
    "paymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planType" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentAdditionalDataId" TEXT,
    CONSTRAINT "Payment_studentAdditionalDataId_fkey" FOREIGN KEY ("studentAdditionalDataId") REFERENCES "StudentAdditionalData" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "id", "method", "paymentDate", "planType", "status") SELECT "amount", "createdAt", "id", "method", "paymentDate", "planType", "status" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE INDEX "Payment_studentAdditionalDataId_idx" ON "Payment"("studentAdditionalDataId");
CREATE TABLE "new_PaymentHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentAdditionalDataId" TEXT,
    CONSTRAINT "PaymentHistory_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PaymentHistory_studentAdditionalDataId_fkey" FOREIGN KEY ("studentAdditionalDataId") REFERENCES "StudentAdditionalData" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PaymentHistory" ("createdAt", "id", "paymentId") SELECT "createdAt", "id", "paymentId" FROM "PaymentHistory";
DROP TABLE "PaymentHistory";
ALTER TABLE "new_PaymentHistory" RENAME TO "PaymentHistory";
CREATE INDEX "PaymentHistory_paymentId_idx" ON "PaymentHistory"("paymentId");
CREATE INDEX "PaymentHistory_studentAdditionalDataId_idx" ON "PaymentHistory"("studentAdditionalDataId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
