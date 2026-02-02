/*
  Warnings:

  - You are about to alter the column `status` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(6))`.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `slipUrl` VARCHAR(191) NULL,
    MODIFY `method` ENUM('PROMPTPAY') NOT NULL DEFAULT 'PROMPTPAY',
    MODIFY `status` ENUM('PENDING', 'WAITING_APPROVAL', 'SUCCESS', 'REJECTED') NOT NULL DEFAULT 'PENDING';
