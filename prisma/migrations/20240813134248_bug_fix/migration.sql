/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AdministratorAdditionalData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `InstructorAdditionalData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `StudentAdditionalData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdministratorAdditionalData_userId_key" ON "AdministratorAdditionalData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InstructorAdditionalData_userId_key" ON "InstructorAdditionalData"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAdditionalData_userId_key" ON "StudentAdditionalData"("userId");
