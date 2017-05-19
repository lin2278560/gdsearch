<?php

namespace Lib\Search;

use Lib\Core\DB;
use Lib\Core\IO;
use Lib\Core\Http;
use Lib\Nfh\Nfh;

class Mail{

    // $toEmails : string | [string()]
    public static function send($toEmails, $title, $body){
        $admin_mail = "gdwyhdszs@126.com";
        $password = "ywt83135073";
        $smtp_server = "smtp.126.com";
        $port = 25;
        $admin_name = "广东省人民政府办公厅";
        $ssl = null;
        $transport = \Swift_SmtpTransport::newInstance($smtp_server, $port, $ssl)
        ->setUsername($admin_mail)
        ->setPassword($password);
        $mailer = \Swift_Mailer::newInstance($transport);
        $message = \Swift_Message::newInstance();
        $message->setContentType('text/html');
        $message->setSubject($title)
        ->setBody(
        $body
        );
        $message->setTo($toEmails);
        $message->setFrom(array($admin_mail => $admin_name));
        $mailer->protocol='smtp';
        $result = $mailer->send($message);
        return $result;
    }
}