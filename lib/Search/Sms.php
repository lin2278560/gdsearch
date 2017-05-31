<?php

namespace Lib\Search;

use Lib\Core\Log;
use Lib\Core\Net;

class Sms{
    private static $apikey = 'b2f3c801173ff222f295e349aa13cf3a';

    // 发送验证码
    // => 1成功，2获取验证码过于频繁，3发送验证码失败
    public static function code($mobile){
        $now = time();
        if(!empty($_SESSION['sms_time']) && $now - $_SESSION['sms_time'] < 60){
            return 2;
        }

        $code = self::gen_code();
        $text = sprintf("【省府网】您的验证码是%s。如非本人操作，请忽略本短信", $code);
        $data = [
            'apikey'    => self::$apikey,
            'mobile'    => $mobile,
            'text'      => $text,
        ];
        
        $json_data = Net::post('https://sms.yunpian.com/v2/sms/single_send.json', http_build_query($data));
        $array = json_decode($json_data, true);

        if($array['code'] != 0){
            Log::debug('发送短信验证错误', $array);
            return 3;
        }else{
            $_SESSION['sms_code'] = $code;
            $_SESSION['sms_time'] = $now;
            return 1;
        }
    }

    // 校验验证码
    public static function check($code){
        if(empty($_SESSION['sms_code'])){
            return false;
        }elseif($_SESSION['sms_code'] != $code) {
            return false;
        }

        return true;
    }


    # 生成随机数
    public static function gen_code($len = 4){
        $s = '';
        for($i = 0; $i < $len; $i ++){
            $s .= self::gen_char();
        }
        return $s;
    }

    public static function gen_char(){
        $cs = ['0','1','2','3','4','5','6','7','8','9'];
        return $cs[rand(0, 9)];
    }
}