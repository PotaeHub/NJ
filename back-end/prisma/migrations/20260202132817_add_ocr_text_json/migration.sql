/*
  Warnings:

  - You are about to alter the column `ocrText` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `ocrText` JSON NULL;
