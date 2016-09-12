<?php

namespace Controller;
use Lib\Core\Data;
use Lib\Core\Log;
use Lib\Core\DB;
use Lib\Core\IO;
use Lib\Search\Search;

class SearchController extends BaseController{

	public function __construct(){
		$file_url = "http://172.18.8.31/zwgk?order_pubdate=-1&prefix_url=006939748&menucat=1001";
		$bsxx_url = "http://www.gdbs.gov.cn/wsbssearch/GetUserData?providername=search";
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
				'file'  => '文件搜索',
				'bsxx'  => '办事信息',
			]
		];
	}

	public function main(){

	}

	public function local(){
		$local_url = "http://172.18.9.63/gdgov/?";
		$keywords 		= IO::I("keywords" , "");
		$keywords_not 	= IO::I("keywords_not" , "");
		$time_from 		= IO::I("time_from" , "");
		$time_to 		= IO::I("time_to" , "");
		$position 		= IO::I("position" , "all");
		$page 			= IO::I("page" , "1");
		$order 			= IO::I("order" , "0");
		$check = str_replace(" ", "", $keywords);
		if ($check == ""&&$time_from ==""&&$time_to=="") {
			IO::E("请输入关键词");
		}
		if ($keywords=="") {
			$keywords = "'*:*'";
		}
		switch ($position) {
			case 'all':
			case '':
				$keyword = "q=" . urlencode($keywords);
				break;
			case 'title':
				$keyword = "stitle=" . urlencode($keywords) . "&q='*:*'";
				break;
			case 'content':
				$keyword = "scontent=" . urlencode($keywords) . "&q='*:*'";
				break;				
		}
		if ($time_to!="") {
			$time_to = date("Y-m-d",$time_to);
		}
		if ($time_from!="") {
			$time_from = date("Y-m-d",$time_from);
		}
		
		$local_url .= $keyword . "&exclude=" . $keywords_not . "&start_applytime=" . $time_from . "&end_applytime=" . $time_to . "&order_by_time=" . $order . "&page=" . $page;
		// var_dump($local_url);die();
		$res = Search::get_article($local_url);
        $data = simplexml_load_string($res,'SimpleXMLElement',LIBXML_NOCDATA);
        $data = Search::object_array($data);  //Object -> array
		if ($data["information"]["page_count"]=="0") {
			IO::O(["total"=>"0","page_total"=>"0","list"=>[]]);
		}

        $total = $data["information"]["count"];
        $page_total = ceil($data["information"]["count"]/20);
        $list = [];
        if ($data["information"]["count"]=="1") {
        	$data["Document"]["url"] = $data["Document"]["link"];
        	unset($data["Document"]["link"]);
			IO::O(["total"=>"1","page_total"=>"1","list"=>["0"=>$data["Document"]]]);
        }

        foreach ($data["Document"] as $key => $value) {
        	$value["url"] = $value["link"];
        	unset($value["link"]);
        	$list[] = $value;
        }
        IO::O(["total"=>$total,"page_total"=>$page_total,"list"=>$list]);
	}

	public function file(){
		$keywords = IO::I("keywords");
		$time_from = IO::I("time_from");
		$time_to = IO::I("time_to");
		$page = IO::I("page");
		$order = IO::I("order");
		$check = str_replace(" ", "", $keywords);
		if ($check == ""&&$time_from ==""&&$time_to=="") {
			IO::E("请输入关键词");
		}
		$file_url = "&q=" . $keywords . "&start_applytime=" . $time_from . "&endtime=" . $time_to . "&page" . $page;
		$res = Search::get_article($file_url);
        $data = simplexml_load_string($res,'SimpleXMLElement',LIBXML_NOCDATA);
        $data = Search::object_array($data);  //Object -> array
        $total = $data["information"]["count"];
        $page_total = ceil($data["information"]["count"]/20);
        unset($data["information"]);
        $list = [];
        foreach ($data as $key => $value) {
        	$value["indexnum"] = $value["INDEXNUM"];
        	unset($value["INDEXNUM"]);
        	$value["url"] = $value["URL"];
        	unset($value["URL"]);
        	$value["title"] = $value["TITLE"];
        	unset($value["TITLE"]);
        	$value["pubdate"] = $value["PUBDATE"];
        	unset($value["PUBDATE"]);
        	$value["content"] = $value["CONTENT"];
        	unset($value["CONTENT"]);
        	$value["publisher"] = $value["PUBLISHER"];
        	unset($value["PUBLISHER"]);
        	$value["filenum"] = $value["FILENUM"];
        	unset($value["FILENUM"]);
        	$value["menucat"] = $value["MENUCAT"];
        	unset($value["MENUCAT"]);
        }
        IO::O(["total"=>$total,"page_total"=>$page_total,"list"=>[$list]]);
	}

	public function bsxx(){
		$searchkey = IO::I("keywords");
		$pageindex = IO::I("page");

		if ($_REQUEST['searchtype']) {
		    $searchtype = $_REQUEST['searchtype'];
		}
		if ($_REQUEST['division']) {
		    $division = $_REQUEST['division'];
		}
		$orgcode = "";
		if ($_REQUEST['orgcode']) {
		    $orgcode = $_REQUEST['orgcode'];
		}

$bsxx_url = $bsxx_url . "&searchkey=" . $searchkey . "&pageindex=" . $pageindex . "&searchtype=" . $searchtype . "&division=" . $division . "&orgcode=" . $orgcode;


	}

}