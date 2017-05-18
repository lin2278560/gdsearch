<?php

namespace Tpl\Admin;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Reply extends TplConfig{

    public function getConfig(){

        $config = TPL::extendConfig('Admin/Common', [
            'js' => [
                'admin/js/reply'
            ],
            'css' => [

            ],
            'less' => [
                'admin/less/letter'
            ]
        ]);

        return $config;
    }

}