<?php

namespace Controller;
use Lib\Core\Data;
use Lib\Core\Log;
use Lib\Core\DB;
use Lib\Core\IO;

class LetterController extends BaseController{

	public function __construct(){

	}

	/*
	 * 在此描述控制器信息及可被路由的方法
	 */
	public function getDesc(){
		return [
			'desc'    => 'LetterController模块',
			'actions' => [
				'main'   => '主页面',
				'submit' => '提交留言内容'
			]
		];
	}

	public function main(){
		
	}


	public function submit(){
		$toCheck = [
			'nickname', 'name',
			'idcard', 'phone',
			'email', 'career',
			'address', 'title',
			'content', 'vericode'
		];
		$data = [];
		foreach ($toCheck as $k) {
			$data[$k] = IO::I($k);
		}
		if(!\Lib\Core\Vericode::check_code($data['vericode'])){
			IO::E('验证码不正确！');
		}
		\Lib\Core\Vericode::flush_code();
		# TODO
		$data["time"] = time();
		var_dump($data);die();
		DB::insert($data,"letter");
		IO::O();
	}

}