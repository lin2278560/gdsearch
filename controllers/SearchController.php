<?php

namespace Controller;
use Lib\Core\Data;
use Lib\Core\Log;
use Lib\Core\DB;
use Lib\Core\IO;
use Lib\Search\Search;
use Lib\Search\Snoopy;

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
				$keyword = "stitle=" . urlencode($keywords) . "&q=" . urlencode($keywords);
				break;
			case 'content':
				$keyword = "scontent=" . urlencode($keywords) . "&q=" . urlencode($keywords);
				break;				
		}
		if ($time_to!="") {
			$time_to = date("Y-m-d",$time_to);
		}
		else{
			$time_to = date("Y-m-d",time());
		}
		if ($time_from!="") {
			$time_from = date("Y-m-d",$time_from);
		}
		else{
			$time_from = "1990-01-01";
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
		$file_url = "http://172.18.8.31/zwgk?prefix_url=006939748";
		$keywords = IO::I("keywords","");
		$time_from = IO::I("time_from","");
		$time_to = IO::I("time_to","");
		$page = IO::I("page","1");
		$order = IO::I("order","");
		$filenumType = IO::I("filenumType","");
		$filenumYear = IO::I("filenumYear","");
		$filenumNum = IO::I("filenumNum","");
		$menucat = IO::I("menucat","");

		$filenum = "";
		if ($filenumType!="") {
			$filenum = $filenumType;
		}
		if ($filenumYear!="") {
			if ($filenum!="") {
				$filenum .= " " . $filenumYear;
			}
			else{
				$filenum = $filenumYear;
			}
		}
		if ($filenumNum!="") {
			if ($filenum!="") {
				$filenum .= " " . $filenumNum;
			}
			else{
				$filenum = $filenumNum;
			}
		}
		if ($filenum!="") {
			$filenum = urlencode($filenum);
		}
			// $filenum = $filenumType . " " . $filenumYear . " " . $filenumNum;

		$check = str_replace(" ", "", $keywords);
		if ($check == ""&&$time_from ==""&&$time_to=="") {
			IO::E("请输入关键词");
		}

		if ($time_to!="") {
			$time_to = date("Y-m-d",$time_to);
		}
		else{
			$time_to = date("Y-m-d",time());
		}
		if ($time_from!="") {
			$time_from = date("Y-m-d",$time_from);
		}
		else{
			$time_from = "1990-01-01";
		}
		$keywords = urlencode($keywords);
		
		$file_url = $file_url . "&q=" . $keywords . "&start_applytime=" . $time_from . "&endtime=" . $time_to . "&page" . $page . "&menucat=" .$menucat . "&filenum=" .$filenum . "&order_pubdate=" . $order . "&page=" . $page;
		$res = Search::get_article($file_url);
        $data = simplexml_load_string($res,'SimpleXMLElement',LIBXML_NOCDATA);
        $data = Search::object_array($data);  //Object -> array
// var_dump($file_url);die();
		if ($data["information"]["page_count"]=="0") {
			IO::O(["total"=>"0","page_total"=>"0","list"=>[]]);
		}

        $total = $data["information"]["count"];
        $page_total = ceil($data["information"]["count"]/20);
        $list = [];
        if ($data["information"]["count"]=="1") {
        	$data["Document"]["indexnum"] = $data["Document"]["INDEXNUM"];
        	unset($data["Document"]["INDEXNUM"]);
        	$data["Document"]["url"] = $data["Document"]["URL"];
        	unset($data["Document"]["URL"]);
        	$data["Document"]["title"] = $data["Document"]["TITLE"];
        	unset($data["Document"]["TITLE"]);
        	$data["Document"]["pubdate"] = $data["Document"]["PUBDATE"];
        	unset($data["Document"]["PUBDATE"]);
        	$data["Document"]["content"] = $data["Document"]["CONTENT"];
        	unset($data["Document"]["CONTENT"]);
        	$data["Document"]["publisher"] = $data["Document"]["PUBLISHER"];
        	unset($data["Document"]["PUBLISHER"]);
        	$data["Document"]["filenum"] = $data["Document"]["FILENUM"];
        	unset($data["Document"]["FILENUM"]);
        	$data["Document"]["menucat"] = $data["Document"]["MENUCAT"];
        	unset($data["Document"]["MENUCAT"]);
        	$data["Document"]["date"] = $data["Document"]["issued"];
			IO::O(["total"=>"1","page_total"=>"1","list"=>["0"=>$data["Document"]]]);
        }


        foreach ($data["Document"] as $key => $value) {
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
        	$value["date"] = $value["issued"];

        	$list[] = $value;
        }
        IO::O(["total"=>$total,"page_total"=>$page_total,"list"=>$list]);
	}

	public function bsxx(){
		$bsxx_url = "http://www.gdbs.gov.cn/wsbssearch/GetUserData?providername=search";

		$searchkey = IO::I("keywords");
		$pageindex = IO::I("page","1");
		$searchtype = IO::I("searchtype","");
		$division = IO::I("division","");
		$orgcode = IO::I("orgcode","");
		$searchkey = urlencode($searchkey);
		// if ($_REQUEST['searchtype']) {
		//     $searchtype = $_REQUEST['searchtype'];
		// }
		// if ($_REQUEST['division']) {
		//     $division = $_REQUEST['division'];
		// }
		// $orgcode = "";
		// if ($_REQUEST['orgcode']) {
		//     $orgcode = $_REQUEST['orgcode'];
		// }

		$bsxx_url = $bsxx_url . "&searchkey=" . $searchkey . "&pageindex=" . $pageindex . "&searchtype=" . $searchtype . "&division=" . $division . "&orgcode=" . $orgcode;
		$s = new Snoopy;
		$result = false;
		for ($i=0; $i<10&&!$result  ; $i++) { 
		   $s->fetch($bsxx_url);
		   preg_match_all("/<a([\s\S]+?)\/a>/i", $s->results, $lines);
		   if ($lines[1]) {
		      $result = true;
		   }   
		   if (!isset($searchkey)) {
		       break;
		   }
		}

		IO::O([
			'result' => $s->results
		]);

		// $res = Search::get_article($bsxx_url);
		// var_dump($bsxx_url);
		// IO::O($res);
	}
}