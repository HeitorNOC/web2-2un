-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaymentHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentAdditionalDataId" TEXT,
    CONSTRAINT "PaymentHistory_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PaymentHistory_studentAdditionalDataId_fkey" FOREIGN KEY ("studentAdditionalDataId") REFERENCES "StudentAdditionalData" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PaymentHistory" ("createdAt", "id", "paymentId", "studentAdditionalDataId") SELECT "createdAt", "id", "paymentId", "studentAdditionalDataId" FROM "PaymentHistory";
DROP TABLE "PaymentHistory";
ALTER TABLE "new_PaymentHistory" RENAME TO "PaymentHistory";
CREATE INDEX "PaymentHistory_paymentId_idx" ON "PaymentHistory"("paymentId");
CREATE INDEX "PaymentHistory_studentAdditionalDataId_idx" ON "PaymentHistory"("studentAdditionalDataId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
