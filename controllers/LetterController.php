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
				'main'    => '主页面',
				'submit'  => '提交留言内容',
				'getList' => '列出留言列表',
				'delete'  => '删除列表'
			]
		];
	}

	public function main(){
		
	}

	public function getList(){
		$kw = IO::I("kw","");
		$offset = IO::I('offset', null, 'uint');
		$count  = IO::I('count', null, 'uint');

		if (!empty($kw)) {
			$total = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE (`title` LIKE '%$kw%' OR `content` LIKE '%$kw%') AND `status`=1 ORDER BY `id` DESC LIMIT $offset,$count");
			$list = DB::all("SELECT * FROM `letter` WHERE (`title` LIKE '%$kw%' OR `content` LIKE '%$kw%') AND `status`=1");
		}
		else{
			$total  = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE `status`=1");
			$list   = DB::all("SELECT `id`,`nickname`,`title`,`time` FROM `letter` WHERE `status`=1 ORDER BY `id` DESC LIMIT $offset,$count");
		}
		IO::O([
			'total' => $total,
			'list'  => $list
		]);
	}

	public function submit(){
		$toCheck = [
			'nickname', 'name',
			'phone', 'email',
			'career', 'address',
			'title','content',
			'vericode'
		];
		$data = [];
		foreach ($toCheck as $k) {
			$data[$k] = IO::I($k);
		}
		$data["idcard"] = IO::I("idcard","");
		if(!\Lib\Core\Vericode::check_code($data['vericode'])){
			IO::E('验证码不正确！');
		}
		\Lib\Core\Vericode::flush_code();
		# TODO
		if (!IO::match_email($data['email'])) {
			IO::E('请输入正确的邮箱地址！');
		}
		$data["time"] = time();
		unset($data["vericode"]);
		DB::insert($data,"letter");
		IO::O();
	}

	public function delete(){
		$id = IO::I("id");
		DB::update(['status' => 0],'letter',"`id`=:id", ['id' => $id]);
		IO::O();
	}

}