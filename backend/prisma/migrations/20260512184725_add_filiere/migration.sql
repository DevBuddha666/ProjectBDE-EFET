-- AlterTable
ALTER TABLE `user` ADD COLUMN `filiere` ENUM('DI', 'CI', 'AGAC', 'FC') NULL;

-- CreateIndex
CREATE INDEX `User_filiere_idx` ON `User`(`filiere`);
