<?php

namespace Tpl\Index;
use Tpl\Config as TplConfig;

class Common extends TplConfig{

	function getConfig(){
        return [
        	'url_root'   => WEBSITE_URL_ROOT,
        	'url_static' => WEBSITE_URL_ROOT . '/' . RUNTIME_DIR_STATIC,
            'css'  => [
                
            ],
            'less' => [
                'index/less/common'
            ],
            'js'   => [
                'core/js/moment',
                'core/js/jquery',
                'core/js/config',
                'core/js/global',
                'index/js/common'
            ],
            'navi'       => [],
            'header_tpl' => $this->dirTpl('Index/Header'),
            'static_tpl' => $this->dirTpl('Core/Static'),
            'tpl_basic'  => RUNTIME_DIR_TPL,
            'tpl'        => [
            ]
        ];
    }

}