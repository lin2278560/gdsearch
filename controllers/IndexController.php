<?php

namespace Controller;
use Lib\Core\Data;
use Lib\Core\Log;
use Lib\Core\DB;
use Lib\Core\IO;

class IndexController extends BaseController{

	public function __construct(){

	}

	/*
	 * 在此描述控制器信息及可被路由的方法
	 */
	public function getDesc(){
		return [
			'desc'    => 'IndexController模块',
			'actions' => [
				'main'   => '主页面',
				'local'  => '本网搜索',
				'file'   => '文件搜索',
				'letter' => '对省长说'
			]
		];
	}

	public function main(){
		$this->show('Index/Main');
	}

	public function local(){
		$this->show('Index/Local');
	}

	public function file(){
		$this->show('Index/File');
	}

	public function letter(){
		$this->show('Index/Letter');
	}

	public function qs(){
		$kw = IO::I('keywords');
		header('Location:http://app.gd.gov.cn/searchplatform/zwgksearch.php?searchword='.urlencode($kw).'&page=1');
	}

	public function gb(){
		$kw = IO::I('keywords');
		header('Location:http://www.gd.gov.cn/govpub/zfgb/');
	}

}