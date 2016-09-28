<?php

namespace Lib\Search;
use Lib\Core\DB;

class Keyword{

	// var $str1;
	// var $str2;
	// var $c = array();
	// /*返回串一和串二的最长公共子序列
	// */
	// public function getLCS($str1, $str2, $len1 = 0, $len2 = 0) {
	// 	$this->str1 = $str1;
	// 	$this->str2 = $str2;
	// 	if ($len1 == 0) $len1 = strlen($str1);
	// 	if ($len2 == 0) $len2 = strlen($str2);
	// 	$this->initC($len1, $len2);
	// 	return $this->printLCS($this->c, $len1 - 1, $len2 - 1);
	// }
	// /*返回两个串的相似度
	// */
	// public function getSimilar($str1, $str2) {
	// 	$len1 = strlen($str1);
	// 	$len2 = strlen($str2);
	// 	$len = strlen($this->getLCS($str1, $str2, $len1, $len2));
	// 	return $len * 2 / ($len1 + $len2);
	// }
	// public function initC($len1, $len2) {
	// 	for ($i = 0; $i < $len1; $i++) $this->c[$i][0] = 0;
	// 	for ($j = 0; $j < $len2; $j++) $this->c[0][$j] = 0;
	// 	for ($i = 1; $i < $len1; $i++) {
	// 		for ($j = 1; $j < $len2; $j++) {
	// 			if ($this->str1[$i] == $this->str2[$j]) {
	// 				$this->c[$i][$j] = $this->c[$i - 1][$j - 1] + 1;
	// 			} else if ($this->c[$i - 1][$j] >= $this->c[$i][$j - 1]) {
	// 				$this->c[$i][$j] = $this->c[$i - 1][$j];
	// 			} else {
	// 				$this->c[$i][$j] = $this->c[$i][$j - 1];
	// 			}
	// 		}
	// 	}
	// }
	// public function printLCS($c, $i, $j) {
	// 	if ($i == 0 || $j == 0) {
	// 		if ($this->str1[$i] == $this->str2[$j]) return $this->str2[$j];
	// 		else return "";
	// 	}
	// 	if ($this->str1[$i] == $this->str2[$j]) {
	// 		return $this->printLCS($this->c, $i - 1, $j - 1).$this->str2[$j];
	// 	} else if ($this->c[$i - 1][$j] >= $this->c[$i][$j - 1]) {
	// 		return $this->printLCS($this->c, $i - 1, $j);
	// 	} else {
	// 		return $this->printLCS($this->c, $i, $j - 1);
	// 	}
	// }

	// $lcs = new LCS();
	//返回最长公共子序列
	// $lcs->getLCS("hello word","hello china");
	//返回相似度
	// echo $lcs->getSimilar("吉林禽业公司火灾已致112人遇难","吉林宝源丰禽业公司火灾已致112人遇难");


	public static function count_keywords($keyword,$type){
		$ip = "";
		$ip = Keyword::getIP();
		$time = time();
		$date = date("Y-m-d H:i:s",$time);
		$replace = ["/"=>"","?"=>"","."=>"",">"=>"",","=>"","<"=>"",
					"\\"=>"","|"=>"","'"=>"","\""=>"",";"=>"",":"=>"",
					"["=>"","{"=>"","]"=>"","}"=>"","!"=>"","@"=>"",
					"#"=>"","$"=>"","%"=>"","^"=>"","&"=>"","("=>"",
					")"=>"","-"=>"","_"=>"","="=>"","+"=>"","`"=>"",
					"~"=>"",":"=>"","*"=>"","，"=>"","。"=>"","："=>"",
					"“"=>"","”"=>"","《"=>"","》"=>"","："=>"","；"=>"",
					"、"=>"","】"=>"","【"=>"","！"=>"","·"=>"","……"=>"",
					"（"=>"","）"=>"","￥"=>""];
		if ($keyword!="*:*") {
			$keyword = strtr($keyword, $replace);
		}
        $p = new \Overtrue\Pinyin\Pinyin;
        $keywords = [];
        $keyword_array = [];
        $keyword_string = "";
        $keywords = explode(" ", $keyword);
        foreach ($keywords as $key => $value) 
        {
        	$k_s ="";
        	$k_s = $p->permalink($value,"_");
        	$keyword_array[] = $k_s;
        }
        $keyword_string = implode($keyword_array, " ");
        $check = DB::assoc("select * from `keyword_count` where `keyword` = '$keyword'");
        if ($check["id"]) {
        	$data["count"] = $check["count"]+1;
        	$id = $check["id"];
        	DB::update($data,"keyword_count","`id` = $id");
        }
        else{
        	$data["keyword"] = $keyword;
        	$data["pinyin"] = $keyword_string;
        	$data["count"] = 1;
        	$data["time"] = $time;
        	DB::insert($data,"keyword_count");
        }
		$insert_data["ip"] = $ip;
		$insert_data["time"] = $time;
		$insert_data["keyword"] = $keyword;
		$insert_data["date"] = $date;
		$insert_data["type"] = $type;
		$insert_data["pinyin"] = $keyword_string;
		DB::insert($insert_data,"keyword_log");
	}

	public static function getIP() 
	{ 
		$ip = "";
		if (getenv("HTTP_CLIENT_IP"))
		{
			$ip = getenv("HTTP_CLIENT_IP");
		}
		else if(getenv("HTTP_X_FORWARDED_FOR"))
		{
			$ip = getenv("HTTP_X_FORWARDED_FOR");
		}
		else if(getenv("REMOTE_ADDR"))
		{	
			$ip = getenv("REMOTE_ADDR");
		}
		else
		{
			$ip = "Unknow";
		}
		return $ip;
	}


}