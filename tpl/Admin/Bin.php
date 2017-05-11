<?php

namespace Tpl\Admin;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Bin extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Admin/Common', [
			'js' => [
				'admin/js/bin'
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