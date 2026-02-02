/*
  Warnings:

  - A unique constraint covering the columns `[slipHash]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `matchScore` INTEGER NULL,
    ADD COLUMN `ocrText` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_slipHash_key` ON `Payment`(`slipHash`);
