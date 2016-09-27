
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `cache_basic` (
  `key` varchar(120) NOT NULL COMMENT '键',
  `value` varchar(1024) NOT NULL COMMENT '值'
) ENGINE=MEMORY DEFAULT CHARSET=utf8 COMMENT='基本缓存表';

CREATE TABLE IF NOT EXISTS `log_admin` (
  `type` varchar(10) NOT NULL,
  `uid` int(11) unsigned NOT NULL,
  `time` int(11) unsigned NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='管理日志';

CREATE TABLE IF NOT EXISTS `log_user` (
  `type` varchar(10) NOT NULL COMMENT '类型',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `data` text NOT NULL COMMENT '数据',
  `time` int(11) NOT NULL COMMENT '执行时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户日志';

CREATE TABLE IF NOT EXISTS `runtime_var` (
  `key` varchar(20) NOT NULL,
  `value` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user_basic` (
  `id` int(11) unsigned NOT NULL COMMENT '用户ID',
  `username` varchar(30) NOT NULL COMMENT '用户名',
  `password` varchar(50) NOT NULL COMMENT '密码',
  `salt` varchar(8) NOT NULL COMMENT '加密盐',
  `email` varchar(200) NOT NULL COMMENT '邮箱',
  `regdate` int(11) unsigned NOT NULL COMMENT '注册日期',
  `lastlogin` int(11) unsigned NOT NULL COMMENT '最后登录日期',
  `logintimes` int(11) unsigned NOT NULL COMMENT '登陆次数',
  `lastip` varchar(15) NOT NULL COMMENT '上次登录IP',
  `group` int(11) NOT NULL COMMENT '用户组',
  `ban` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户_基本信息表';

CREATE TABLE IF NOT EXISTS `user_group` (
  `id` int(11) NOT NULL COMMENT '编号',
  `name` varchar(30) NOT NULL COMMENT '名称',
  `char_list` text COMMENT '角色',
  `parent` int(11) unsigned NOT NULL COMMENT '父用户组'
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户组';

ALTER TABLE `cache_basic`
  ADD PRIMARY KEY (`key`) COMMENT 'key';

ALTER TABLE `log_admin`
  ADD KEY `type` (`type`);

ALTER TABLE `runtime_var`
  ADD PRIMARY KEY (`key`);

ALTER TABLE `user_basic`
  ADD PRIMARY KEY (`id`) COMMENT '用户ID主键', ADD KEY `group` (`group`);

ALTER TABLE `user_group`
  ADD PRIMARY KEY (`id`) COMMENT 'id', ADD KEY `parent` (`parent`);

ALTER TABLE `user_basic`
  MODIFY `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',AUTO_INCREMENT=1;

ALTER TABLE `user_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号',AUTO_INCREMENT=1;

INSERT INTO `user_group` (`id`, `name`, `char_list`, `parent`) VALUES
(1, '管理员', NULL, 0),
(2, '普通用户', NULL, 0);

CREATE TABLE `auth_controller` ( `controller` VARCHAR(64) NOT NULL , `action` VARCHAR(64) NOT NULL , `controller_desc` VARCHAR(64) NOT NULL , `action_desc` VARCHAR(64) NOT NULL , INDEX (`controller`) ) ENGINE = InnoDB;
CREATE TABLE `auth_controller_ignore` ( `controller` VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , `action` VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL , PRIMARY KEY (`controller`, `action`) ) ENGINE = InnoDB;


CREATE TABLE `character` ( `id` INT(11) UNSIGNED NOT NULL , `name` VARCHAR(32) NOT NULL , PRIMARY KEY (`id`) ) ENGINE = InnoDB;
ALTER TABLE `character` CHANGE `id` `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT;
ALTER TABLE `character` CHANGE `name` `name` VARCHAR(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
CREATE TABLE `auth_character_controller` ( `character_id` INT(11) UNSIGNED NOT NULL , `controller` VARCHAR(64) NOT NULL , `action` VARCHAR(64) NOT NULL , PRIMARY KEY (`character_id`, `controller`, `action`) , INDEX (`controller`) , INDEX (`action`) ) ENGINE = InnoDB;
CREATE TABLE `user_character` ( `uid` BIGINT(20) UNSIGNED NOT NULL , `cid` INT(11) UNSIGNED NOT NULL , PRIMARY KEY (`uid`, `cid`) ) ENGINE = InnoDB;
ALTER TABLE `user_character` ADD INDEX (`uid`) COMMENT '';
CREATE TABLE `user_group_character` ( `gid` INT(11) UNSIGNED NOT NULL , `cid` INT(11) UNSIGNED NOT NULL , PRIMARY KEY (`gid`, `cid`) ) ENGINE = InnoDB;
ALTER TABLE `user_group_character` ADD UNIQUE (`gid`) COMMENT '';
ALTER TABLE `user_group_character` DROP INDEX `gid`, ADD INDEX `gid` (`gid`) COMMENT '';

INSERT INTO `auth_controller_ignore` (`controller`, `action`) VALUES
('Index', 'main'),
('Index', 'local'),
('Index', 'letter'),
('Index', 'gb'),
('Index', 'file'),
('Index', 'bsxx'),
('Index', 'qs'),
('Search', 'local'),
('Search', 'gb'),
('Search', 'file'),
('Search', 'bsxx'),
('Letter', 'submit'),
('Core', 'call'),
('User', 'checkLogin'),
('User', 'login'),
('User', 'logined'),
('Vericode', 'check'),
('Vericode', 'simple');
INSERT INTO `character` (`id`, `name`) VALUES
(1, '系统管理员');
INSERT INTO `auth_character_controller` (`character_id`, `controller`, `action`) VALUES
(1, 'Admin', 'auth'),
(1, 'Admin', 'character'),
(1, 'Admin', 'main'),
(1, 'Admin', 'user'),
(1, 'Admin', 'usergroup'),
(1, 'Auth', 'addCAIgnore'),
(1, 'Auth', 'addCharacterCA'),
(1, 'Auth', 'delCAIgnore'),
(1, 'Auth', 'delCharacterCA'),
(1, 'Auth', 'listCA'),
(1, 'Auth', 'listCharacterCA'),
(1, 'Auth', 'main'),
(1, 'Index', 'main'),
(1, 'User', 'addCharacter'),
(1, 'User', 'addGroup'),
(1, 'User', 'addGroupCharacter'),
(1, 'User', 'addUser'),
(1, 'User', 'addUserCharacter'),
(1, 'User', 'banUser'),
(1, 'User', 'checkLogin'),
(1, 'User', 'delCharacter'),
(1, 'User', 'delGroupCharacter'),
(1, 'User', 'delUserCharacter'),
(1, 'User', 'editUser'),
(1, 'User', 'groupList'),
(1, 'User', 'listCharacter'),
(1, 'User', 'listGroupCharacter'),
(1, 'User', 'listUserCharacter'),
(1, 'User', 'login'),
(1, 'User', 'logined'),
(1, 'User', 'logout'),
(1, 'User', 'moveGroup'),
(1, 'User', 'moveUser'),
(1, 'User', 'removeGroup'),
(1, 'User', 'removeUser'),
(1, 'User', 'renameCharacter'),
(1, 'User', 'renameGroup'),
(1, 'User', 'searchList'),
(1, 'User', 'setGroupCharacter'),
(1, 'User', 'userList'),
(1, 'Vericode', 'check'),
(1, 'Vericode', 'simple');

