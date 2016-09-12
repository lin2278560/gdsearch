<?php

namespace Tpl\Index;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class LocalAdvance extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Core/Common', [
			'js'   => [
				'index/js/localadvance'
			],
			'less' => [
				'index/less/localadvance'
			]
		]);

		return $config;
	}

}