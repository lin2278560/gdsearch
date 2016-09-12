<?php

namespace Lib\Search;

class Search{

    public function static change_to_json($page_result){
    	$result_json = "";
    	preg_match_all("/<body>([\s\S]+?)<\/body>/i", $page_result, $lines);
    		$lng = count($lines[1]);
    	for($i = 0; $i < $lng; $i ++){
    		$result_json .= '' .  $lines[1][$i] . '';
    	}
    	return json_decode($result_json,true);
    }


    public function static object_array($array) {  
        if(is_object($array)) {  
            $array = (array)$array;  
         } if(is_array($array)) {  
             foreach($array as $key=>$value) {  
                 $array[$key] = self::object_array($value);  
                 }  
         }  
         return $array;
    }

    public static function get_article($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $res = curl_exec($ch);
        $code = curl_getinfo($ch,CURLINFO_HTTP_CODE);
        curl_close($ch);
        // if($code!="200"){
        //     return false;
        // }
        // else{
            return $res;
        // }
    }

}