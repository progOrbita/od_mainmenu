<?php

class Od_MainMenuMainmenuModuleFrontController extends ModuleFrontController
{
    public function displayAjax()
    {
        /** @var Od_MainMenu $module */
        $module = $this->module;
        $id = Tools::getValue('dataInfo');
        $this->ajaxDie($module->renderWidget('displayNav2',['id' => $id]));
    }
}
