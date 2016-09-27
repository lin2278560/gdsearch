<?php

namespace Tpl\Index;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class File extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Index/Common', [
			'js'   => [
				'index/js/file'
			],
			'less' => [
				'index/less/file'
			]
		]);

		return $config;
	}

}