<?php

namespace Tpl\Admin;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class ViewLetter extends TplConfig{

	public function getConfig(){
		
		global $_RG;
		$_RG['navi_action'] ='letter';

		$config = TPL::extendConfig('Admin/Common', [
			'js' => [
				'admin/js/viewletter'
			],
			'css' => [

			],
			'less' => [
				'admin/less/viewletter'
			],
		]);

		return $config;
	}

}