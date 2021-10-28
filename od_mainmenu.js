
// TODO load this file if not loaded with theme

/*import $ from 'jquery';*/

//main already inserted
const categories_displayed = ['1'];
$(function () {
    // Ocultar todos los elementos en depth=3 (limpiar el submenu)
    
    $("ul[data-depth='2']").on('mouseover', ' li', function() {
    $(document).on('mouseover', "ul[data-depth='2'] li", function() {
        // Ocultar todos los elementos en depth=3 (limpiar el submenu)
        $("ul[data-depth='2']").find("ul[data-depth='3']").parent().removeClass('show');
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
        let id_category = $(this).attr('id').match(/\d+/g)[0];

        if(depth > 2){
            return;
        }
        if(categories_displayed.includes(id_category)){
            return;
        }
        categories_displayed.push(id_category);
        let item = $(this);
        $(this).find('.item-header').addClass('collapsed');
        $(this).find('.item-header').attr('aria-expanded',false);
        let depth = $(this).find('.nav-link').attr('data-depth');
        let link = prestashop.modules.od_mainmenu.endpoint;
        $.ajax({
            url: link,
            data: {
                ajax: true,id_category,depth,
            },
            success: function(data){
                //Append to the end
                item.append(data);
                item.find('.collapse').addClass('show');
                if(depth == 2){
                    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().removeClass('show');
                    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
                    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
                }
            }
        });
    });
    $(document).on( 'mouseenter','#top-menu', function(){
        $(this).find('.collapse .show').removeClass('show');
    });