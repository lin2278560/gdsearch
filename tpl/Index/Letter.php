<?php

namespace Tpl\Index;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Letter extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Core/Common', [
            'header_tpl' => $this->dirTpl('Core/EmptyHeader'),
			'js'   => [
				'index/js/letter'
			],
			'css'  => [
				'core/css/weui.min'
			],
			'less' => [
				'index/less/letter'
			]
		]);

		return $config;
	}

}