-- AlterTable
ALTER TABLE `Poll` ADD COLUMN `filiere` ENUM('DI', 'CI', 'AGAC', 'FC') NULL;

-- CreateIndex
CREATE INDEX `Poll_filiere_idx` ON `Poll`(`filiere`);

-- DropIndex
DROP INDEX `Vote_pollId_voterId_key` ON `Vote`;

-- AddUniqueConstraint
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_pollId_voterId_optionId_key` UNIQUE (`pollId`, `voterId`, `optionId`);
