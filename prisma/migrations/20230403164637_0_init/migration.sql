-- CreateTable
CREATE TABLE `groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `profile_image` VARCHAR(255) NULL,
    `ruleset` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `owner_id` INTEGER NOT NULL,
    `group_id` INTEGER NULL,

    INDEX `list_group_id_fkey`(`group_id`),
    INDEX `list_owner_id_fkey`(`owner_id`),
    UNIQUE INDEX `name_owner_uq`(`name`, `owner_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie_list` (
    `list_id` INTEGER NOT NULL,
    `movie_id` INTEGER NOT NULL,
    `status` ENUM('UNREAD', 'SEARCHING', 'FOUND_NO_SUB', 'FOUND_SUB', 'CANT_FIND', 'WATCHED') NULL DEFAULT 'UNREAD',

    INDEX `movie_list_movie_id_fkey`(`movie_id`),
    PRIMARY KEY (`list_id`, `movie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movies` (
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
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `profile_image` VARCHAR(255) NULL,

    UNIQUE INDEX `users_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `list` ADD CONSTRAINT `list_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `list` ADD CONSTRAINT `list_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_list` ADD CONSTRAINT `movie_list_list_id_fkey` FOREIGN KEY (`list_id`) REFERENCES `list`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `movie_list` ADD CONSTRAINT `movie_list_movie_id_fkey` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
