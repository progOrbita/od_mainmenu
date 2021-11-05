<?php

class Od_MainMenuMainmenuModuleFrontController extends ModuleFrontController
{
    public function displayAjax()
    {
        /** @var Od_MainMenu $module */
        $module = $this->module;

        $this->ajaxDie($module->renderWidget('displayNav2', ['id_category' => Tools::getValue('id_category'), 'depth' => Tools::getValue('category_depth')]));
    }
}
