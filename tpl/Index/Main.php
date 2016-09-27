<?php

namespace Tpl\Index;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Main extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Index/Common', [
			'js'   => [
				'index/js/main'
			],
			'less' => [
				'index/less/main'
			],
            'header_tpl' => $this->dirTpl('Core/EmptyHeader'),
		]);

		return $config;
	}

}