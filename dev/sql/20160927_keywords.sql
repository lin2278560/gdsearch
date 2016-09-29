CREATE TABLE `keyword_log` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `keyword` VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , `ip` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , `time` INT UNSIGNED NOT NULL , `date` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , PRIMARY KEY (`id`) ) ENGINE = InnoDB;
ALTER TABLE `keyword_log` ADD `type` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL AFTER `ip`;
CREATE TABLE `keyword_count` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `keyword` TEXT NOT NULL , `pinyin` TEXT NOT NULL , `count` BIGINT UNSIGNED NOT NULL , PRIMARY KEY (`id`) ) ENGINE = InnoDB;
ALTER TABLE `keyword_log` CHANGE `keyword` `keyword` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
ALTER TABLE `keyword_log` ADD `pinyin` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL AFTER `keyword`;
ALTER TABLE `keyword_count` ADD `time` INT(10) UNSIGNED NOT NULL ;
ALTER TABLE `keyword_log` CHANGE `keyword` `keyword` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL, CHANGE `pinyin` `pinyin` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;