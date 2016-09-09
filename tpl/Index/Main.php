<?php

namespace Tpl\Index;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Main extends TplConfig{

	public function getConfig(){

		$config = TPL::extendConfig('Core/Common', [
			
		]);

		return $config;
	}

}