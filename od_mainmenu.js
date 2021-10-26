
// TODO load this file if not loaded with theme

/*import $ from 'jquery';*/

$(function () {
    // Ocultar todos los elementos en depth=3 (limpiar el submenu)
    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
    
    $("ul[data-depth='2']").on('mouseover', ' li', function() {
        // Ocultar todos los elementos en depth=3 (limpiar el submenu)
        $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
        $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
        
        // Mostrar solo los children del elemento sobre el que estamos
        if(this.children[1]) {
            $(this).find("ul[data-depth='3']").parent().removeClass('hidden');
            $(this).find("ul[data-depth='3']").parent().attr('aria-expanded', true);
        }
    });    
});

$(document).ready(function(){

    $('.nav-link').on('mouseover', function(e){
        e.preventDefault();
        link = prestashop.modules.od_mainmenu.endpoint;
        let ajaxRequest = $.ajax({
            url: link,
            data: {
                ajax: true,
                type: 'POST',
            },
        });
        ajaxRequest.done(function(data){
            console.log(data);
        });

    });
});