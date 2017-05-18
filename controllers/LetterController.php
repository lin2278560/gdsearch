<?php

namespace Controller;
use Lib\Core\Data;
use Lib\Core\Log;
use Lib\Core\DB;
use Lib\Core\IO;
use Lib\Search\Mail;

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
				'delete'  => '删除列表',
				'bin'	  => '回收站',
				'recover' => '恢复留言',
				'reject'	=> '拒绝回复',
				'reply'		=> '回复留言',
				'replyList' => '已回复的留言列表',
				'rejectList' => '已拒绝回复的留言列表',
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
			$total = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE (`title` LIKE '%$kw%') AND `status`>=1 ORDER BY `id` DESC LIMIT $offset,$count");
			// $total = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE (`title` LIKE '%$kw%' OR `content` LIKE '%$kw%') AND `status`=1 ORDER BY `id` DESC LIMIT $offset,$count");
			$list = DB::all("SELECT * FROM `letter` WHERE (`title` LIKE '%$kw%') AND `status`>=1");
			// $list = DB::all("SELECT * FROM `letter` WHERE (`title` LIKE '%$kw%' OR `content` LIKE '%$kw%') AND `status`=1");
		}
		else{
			$total  = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE `status`>=1");
			$list   = DB::all("SELECT `id`,`nickname`,`title`,`time` FROM `letter` WHERE `status`>=1 ORDER BY `id` DESC LIMIT $offset,$count");
		}
		IO::O([
			'total' => $total,
			'list'  => $list
		]);
	}

	public function bin(){
		$kw = IO::I("kw","");
		$offset = IO::I('offset', null, 'uint');
		$count  = IO::I('count', null, 'uint');

		if (!empty($kw)) {
			$total = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE (`title` LIKE '%$kw%') AND `status`=0 ORDER BY `id` DESC LIMIT $offset,$count");
			// $total = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE (`title` LIKE '%$kw%' OR `content` LIKE '%$kw%') AND `status`=1 ORDER BY `id` DESC LIMIT $offset,$count");
			$list = DB::all("SELECT * FROM `letter` WHERE (`title` LIKE '%$kw%') AND `status`=0");
			// $list = DB::all("SELECT * FROM `letter` WHERE (`title` LIKE '%$kw%' OR `content` LIKE '%$kw%') AND `status`=1");
		}
		else{
			$total  = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE `status`=0");
			$list   = DB::all("SELECT `id`,`nickname`,`title`,`time`,`status` FROM `letter` WHERE `status`=0 ORDER BY `id` DESC LIMIT $offset,$count");
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

	public function recover(){
		$id = IO::I("id");
		DB::update(['status' => 1],'letter',"`id`=:id", ['id' => $id]);
		IO::O();
	}

	/*
	status: 0已删除,1未处理,2已拒绝,3已回复
	*/
	public function reply(){
		$id = IO::I("id");
		$replyMsg = IO::I("content");
		$content = IO::filt_script($replyMsg);

		$letter = DB::assoc("SELECT * from `letter` WHERE `id` = :id LIMIT 1", ['id' => $id]);
		if(!$letter){
			IO::E("该留言不存在");
		}elseif(!is_null($letter['status']) && $letter['status'] != 1){
			IO::E("该留言已经回复过了，不能再次回复");
		}elseif(!$letter['email']){
			IO::E("该留言的邮箱地址为空");
		}

		$title = '关于"'.$letter['title'].'"留言的回复';
		if(Mail::send($letter['email'], $title, $content) != 0){
			DB::update(['status' => 3], 'letter', "`id`=:id", ['id' => $id]);
			DB::insert([
				'id' => $id,
				'from_status' => $letter['status'],
				'to_status' => 3,
				'content' => $content,
				'time' => time(),
				], 'letter_reply');
			IO::O();
		}

		IO::E("回复邮箱失败");
	}

	public function reject(){
		$id = IO::I("id");

		$letter = DB::assoc("SELECT * from `letter` WHERE `id` = :id LIMIT 1", ['id' => $id]);
		if(!$letter){
			IO::E("该留言不存在");
		}elseif(!is_null($letter['status']) && $letter['status'] != 1){
			IO::E("该留言已经回复过了，不能再次回复");
		}elseif(!$letter['email']){
			IO::E("该留言的邮箱地址为空");
		}

		$title = '关于"'.$letter['title'].'"留言的回复';
		$content = '    您好，您的留言涉及投诉举报事项，建议您通过广东信访网“网上信访”栏目（http://www.gdwsxf.gov.cn/web/wsxf.html?menuType=wsxf）提交请求。';
		if(Mail::send($letter['email'], $title, $content) != 0){
			DB::update(['status' => 2], 'letter', "`id`=:id", ['id' => $id]);
			DB::insert([
				'id' => $id,
				'from_status' => $letter['status'],
				'to_status' => 2,
				// 'content' => $content,
				'time' => time(),
				], 'letter_reply');
			IO::O();
		}

		IO::E("回复邮箱失败");
	}

	public function replyList(){
		$kw = IO::I("kw","");
		$offset = IO::I('offset', null, 'uint');
		$count  = IO::I('count', null, 'uint');

		if(!empty($kw)) {
			$kwCond = "AND `title` LIKE '%$kw%'";
		}
		else{
			$kwCond = '';
		}

		$total  = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE `status` = 3 $kwCond");
		$list   = DB::all("SELECT `id`,`nickname`,`title`,`time`,`status` FROM `letter` WHERE `status` = 3 $kwCond ORDER BY `id` DESC LIMIT $offset,$count");

		IO::O([
			'total' => $total,
			'list'  => $list
		]);
	}

	public function rejectList(){
		$kw = IO::I("kw","");
		$offset = IO::I('offset', null, 'uint');
		$count  = IO::I('count', null, 'uint');

		if(!empty($kw)) {
			$kwCond = "AND `title` LIKE '%$kw%'";
		}
		else{
			$kwCond = '';
		}

		$total  = DB::one("SELECT COUNT(`id`) FROM `letter` WHERE `status` = 2 $kwCond");
		$list   = DB::all("SELECT `id`,`nickname`,`title`,`time`,`status` FROM `letter` WHERE `status` = 2 $kwCond ORDER BY `id` DESC LIMIT $offset,$count");

		IO::O([
			'total' => $total,
			'list'  => $list
		]);
	}

}