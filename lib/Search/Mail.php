<?php

namespace Lib\Search;

use Lib\Core\DB;
use Lib\Core\IO;
use Lib\Core\Http;
use Lib\Nfh\Nfh;

class Mail{

    public static function send($users, $title, $body, $ssl=null){
        $admin_mail = "vanchen1@126.com";
        $password = "test123";
        $smtp_server = "smtp.126.com";
        $port = 25;
        $admin_name = "广东省人民政府办公厅";
        $transport = \Swift_SmtpTransport::newInstance($smtp_server, $port,$ssl)
        ->setUsername($admin_mail)
        ->setPassword($password);
        $mailer = \Swift_Mailer::newInstance($transport);
        $message = \Swift_Message::newInstance();
        $message->setContentType('text/html');
        $message->setSubject($title)
        ->setBody(
        $body
        );
        // $message->setTo(array('1064376217@qq.com' => '我'));
        $message->setTo($users);
        $message->setFrom(array($admin_mail => $admin_name));
        // $message->setFrom(array('nfhregister@126.com' => '测试'));
        $mailer->protocol='smtp';
        $result = $mailer->send($message);
        return $result;
    }
}