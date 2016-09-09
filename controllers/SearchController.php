<?php

namespace Controller;
use Lib\Core\Data;
use Lib\Core\Log;
use Lib\Core\DB;
use Lib\Core\IO;

class SearchController extends BaseController{

	public function __construct(){

	}

	/*
	 * 在此描述控制器信息及可被路由的方法
	 */
	public function getDesc(){
		return [
			'desc'    => 'SearchController模块',
			'actions' => [
				'main'  => '主页面',
				'local' => '本站搜索',
				'flie'  => '文件搜索',
				'bsxx'  => '办事信息',
			]
		];
	}

	public function main(){
		
	}

}