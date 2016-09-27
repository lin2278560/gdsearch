<?php

namespace Tpl\Admin;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Letter extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Admin/Common', [
			'js' => [
				'admin/js/letter'
			],
			'css' => [

			],
			'less' => [
				'admin/less/letter'
			]
		]);

		return $config;
	}

}