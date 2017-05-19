<?php

namespace Controller;

use Lib\User\User;
use Lib\Core\IO;
use Lib\Core\DB;

class AdminController extends BaseController{

	public function __construct(){

	}

	public function main(){
		$this->show('Admin/Main');
	}

	public function user(){
		$this->show('Admin/User');
	}

	public function auth(){
		$this->show('Admin/Auth');
	}

	public function usergroup(){
		$this->show('Admin/UserGroup');
	}

	public function character(){
		$this->show('Admin/Character', [
			'ca_json' => json_encode(\Lib\User\Auth::list_controllers()),
			'ca_ignore_json' => json_encode(\Lib\User\Auth::list_controller_ignore()),
		]);
	}

	public function letter(){
		$this->show('Admin/Letter');
	}

	public function bin(){
		$this->show('Admin/Bin');
	}

	public function pending(){
		$this->show('Admin/Pending');
	}

	public function reply(){
		$this->show('Admin/Reply');
	}

	public function viewLetter(){
		$id = IO::I('id', null, 'uint');
		$data = DB::assoc("SELECT * FROM `letter` WHERE `id`=:id", ['id' => $id]);
		$replyContents = DB::all_one("SELECT `content` FROM `letter_reply` WHERE `id`=:id", ['id' => $id]);
		// 去掉空内容
		$replyContents = array_filter($replyContents, function($var) {return strlen($var);});
		$data['reply'] = $replyContents;
		$this->show('Admin/ViewLetter', [
			'letter_data' => $data
		]);
	}

	public function getDesc(){
		return [
			'desc'    => '管理模块',
			'actions' => [
				'main'       => '概述',
				'user'       => '用户管理',
				'auth'       => '权限列表',
				'usergroup'  => '用户组管理',
				'character'  => '角色定义',
				'letter'     => '留言管理',
				'viewLetter' => '留言查看',
				'bin' 	  	 => '查看回收站',
				'pending' 	  	 => '待处理留言',
				'reply' 	  	 => '已回复留言',
			]
		];
	}

}