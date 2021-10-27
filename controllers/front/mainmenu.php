<?php

class Od_MainMenuMainmenuModuleFrontController extends ModuleFrontController
{
    public function displayAjax()
    {
        /** @var Od_MainMenu $module */
        $module = $this->module;
        $cat_info = Tools::getValue('dataInfo');

        $this->ajaxDie($module->renderWidget('displayNav2',['id' => $cat_info['id'], 'depth' => $cat_info['depth']]));
    }
}
