-- DropForeignKey
ALTER TABLE `poll` DROP FOREIGN KEY `Poll_classId_fkey`;

-- AlterTable
ALTER TABLE `poll` MODIFY `classId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Poll` ADD CONSTRAINT `Poll_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
