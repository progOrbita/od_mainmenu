
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
    $(document).on( 'mouseenter','.category', function(){
        let item = $(this);
        let depth = $(this).find('.nav-link').attr('data-depth');
        let id_category = $(this).attr('id').match(/\d+/g)[0];
        let link = prestashop.modules.od_mainmenu.endpoint;

        let ajaxRequest = $.ajax({
            url: link,
            data: {
                ajax: true,id_category,depth,
            },
        });
        ajaxRequest.done(function(data){

            item.append(data);
        });

        return;
    });