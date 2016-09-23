<?php

namespace Tpl\Index;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Gb extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Core/Common', [
			'js'   => [
				'index/js/gb'
			],
			'less' => [
				'index/less/gb'
			]
		]);

		return $config;
	}

}