<?php

namespace Tpl\Index;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Local extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Core/Common', [
			'js'   => [
				'index/js/local'
			],
			'less' => [
				'index/less/local'
			]
		]);

		return $config;
	}

}