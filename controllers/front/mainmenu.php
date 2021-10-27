<?php

class Od_MainMenuMainmenuModuleFrontController extends ModuleFrontController
{
    public function displayAjax()
    {
        /** @var Od_MainMenu $module */
        $module = $this->module;
        $jsonData = json_decode($_GET['dataString'])+3;
        $this->ajaxDie($module->renderWidget('displayNav2',['depth' => $jsonData]));
    }
}
