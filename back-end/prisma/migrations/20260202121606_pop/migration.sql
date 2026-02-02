-- AlterTable
ALTER TABLE `payment` ADD COLUMN `autoApproved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `slipHash` VARCHAR(191) NULL;
