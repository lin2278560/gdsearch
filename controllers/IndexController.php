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
				'bsxx'   => '办事信息',
				'letter' => '对省长说'
			]
		];
	}

	public function main(){
		$this->show('Index/Main');
	}

	public function local(){
		$this->show('Index/Local', [
			'title' => '本网搜索 - 广东省人民政府门户网站'
		]);
	}

	public function file(){
		$this->show('Index/File', [
			'year_list' => range(1999, intval(date('Y'))),
			'title' => '省政府文件搜索 - 广东省人民政府门户网站'
		]);
	}

	public function bsxx(){
		$this->show('Index/Bsxx', [
			'title' => '办事信息 - 广东省人民政府门户网站'
		]);
	}

	public function letter(){
		$this->show('Index/Letter', [
			'title' => '我有话对省长说 - 广东省人民政府门户网站'
		]);
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