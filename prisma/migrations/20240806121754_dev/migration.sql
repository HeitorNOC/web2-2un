-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "cpf" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "isActive" INTEGER NOT NULL DEFAULT 2,
    "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("cpf", "email", "emailVerified", "id", "image", "isActive", "isTwoFactorEnabled", "name", "password", "role") SELECT "cpf", "email", "emailVerified", "id", "image", "isActive", "isTwoFactorEnabled", "name", "password", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
CREATE INDEX "User_role_idx" ON "User"("role");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
