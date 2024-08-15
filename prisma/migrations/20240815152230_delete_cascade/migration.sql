/*
  Warnings:

  - You are about to drop the column `name` on the `InstructorAdditionalData` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InstructorAdditionalData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "cref" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InstructorAdditionalData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InstructorAdditionalData" ("createdAt", "cref", "id", "phone", "updatedAt", "userId") SELECT "createdAt", "cref", "id", "phone", "updatedAt", "userId" FROM "InstructorAdditionalData";
DROP TABLE "InstructorAdditionalData";
ALTER TABLE "new_InstructorAdditionalData" RENAME TO "InstructorAdditionalData";
CREATE UNIQUE INDEX "InstructorAdditionalData_userId_key" ON "InstructorAdditionalData"("userId");
CREATE UNIQUE INDEX "InstructorAdditionalData_cref_key" ON "InstructorAdditionalData"("cref");
CREATE INDEX "InstructorAdditionalData_id_idx" ON "InstructorAdditionalData"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
