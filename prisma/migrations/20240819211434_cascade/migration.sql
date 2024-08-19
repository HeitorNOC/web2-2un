-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "machineId" TEXT NOT NULL,
    "trainingBlockId" TEXT NOT NULL,
    "series" INTEGER,
    "repetitions" INTEGER,
    "suggestedWeight" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Exercise_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Exercise_trainingBlockId_fkey" FOREIGN KEY ("trainingBlockId") REFERENCES "TrainingBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("createdAt", "description", "id", "machineId", "name", "repetitions", "series", "suggestedWeight", "trainingBlockId", "updatedAt") SELECT "createdAt", "description", "id", "machineId", "name", "repetitions", "series", "suggestedWeight", "trainingBlockId", "updatedAt" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE TABLE "new_TrainingBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingBlock_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TrainingBlock" ("createdAt", "id", "name", "trainingId", "type", "updatedAt") SELECT "createdAt", "id", "name", "trainingId", "type", "updatedAt" FROM "TrainingBlock";
DROP TABLE "TrainingBlock";
ALTER TABLE "new_TrainingBlock" RENAME TO "TrainingBlock";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
