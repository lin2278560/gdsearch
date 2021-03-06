ALTER TABLE `letter` ADD COLUMN `status` INT(11) UNSIGNED DEFAULT NULL COMMENT '0已删除1未处理2已拒绝3已回复';
DROP TABLE IF EXISTS `letter_reply`;
CREATE TABLE `letter_reply` (
  `id` INT(10) NOT NULL,
  `from_status` TINYINT(1) UNSIGNED COMMENT '',
  `to_status` TINYINT(1) UNSIGNED COMMENT '',
  `content` TEXT COMMENT '回复内容',
  `time` INT(10) UNSIGNED NOT NULL COMMENT '时间',
  KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;