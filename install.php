<?php

require __DIR__.'/global.php';

session_start();

\Lib\User\User::add_user([
	'username' => 'freya',
	'password' => md5('freya'),
	'email'    => 'freya@local.host',
	'group'    => 1
]);


