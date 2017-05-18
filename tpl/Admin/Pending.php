<?php

namespace Tpl\Admin;
use Tpl\Config as TplConfig;
use Lib\Core\TPL as TPL;

class Pending extends TplConfig{

    public function getConfig(){

        $config = TPL::extendConfig('Admin/Common', [
            'js' => [
                'admin/js/pending'
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