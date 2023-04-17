/*
  Warnings:

  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `movies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `list` DROP FOREIGN KEY `list_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `list` DROP FOREIGN KEY `list_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `movie_list` DROP FOREIGN KEY `movie_list_movie_id_fkey`;

-- DropTable
DROP TABLE `groups`;

-- DropTable
DROP TABLE `movies`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `profile_image` VARCHAR(255) NULL,
    `ruleset` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `year` INTEGER NOT NULL,
    `imdb_url` VARCHAR(255) NULL,
    `runtime` VARCHAR(45) NULL,
    `director` VARCHAR(45) NULL,
    `additional_note` VARCHAR(255) NULL,
    `language` VARCHAR(3) NULL,

    UNIQUE INDEX `title_year_uq`(`title`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `profile_image` VARCHAR(255) NULL,

    UNIQUE INDEX `user_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `list` ADD CONSTRAINT `list_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `list` ADD CONSTRAINT `list_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_list` ADD CONSTRAINT `movie_list_movie_id_fkey` FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
