<?php

namespace Tpl\Index;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Bsxx extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Core/Common', [
			'js'   => [
				'index/js/bsxx'
			],
			'less' => [
				'index/less/bsxx'
			]
		]);

		return $config;
	}

}