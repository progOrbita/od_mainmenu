
// TODO load this file if not loaded with theme

/*import $ from 'jquery';*/

$(function () {
    // Ocultar todos los elementos en depth=3 (limpiar el submenu)
    
    $("ul[data-depth='2']").on('mouseover', ' li', function() {
const categories_displayed = [1];
var category;
var request;

    $(document).on('mouseover', "ul[data-depth='2'] li", function() {
        // Hide all the elements in depth=3 (cleans the submenu)
        $("ul[data-depth='2']").find("ul[data-depth='3']").parent().removeClass('show');
        $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
        $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
        // Shows only the children of the element where we stood
        if(this.children[1]) {
            $(this).find("ul[data-depth='3']").parent().removeClass('hidden');
            $(this).find("ul[data-depth='3']").parent().attr('aria-expanded', true);
        }
    });

    $(document).on( 'mouseenter','.category', function(){

        let selected_cat = $(this);
        let id_category = parseInt(selected_cat.attr('id').match(/\d+/g)[0]);
                
        let depth = parseInt(selected_cat.find('.nav-link').data('depth'));
        
        if(categories_displayed.includes(id_category)){
            return;
        }

        if(category == id_category){

            return;
        }
        categories_displayed.push(id_category);
        let item = $(this);
        $(this).find('.item-header').addClass('collapsed');
        $(this).find('.item-header').attr('aria-expanded',false);
        
        category = id_category;
        request = $.ajax({
            url: prestashop.modules.od_mainmenu.endpoint,
            data: {
                ajax: true,id_category,depth,
            },
            success: function(data){
                //Append to the end of the div
                item.append(data);
                item.find('.collapse').addClass('show');
                //Cleans the elements with depth=3 when inserted
                if(depth == 2){
                    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
                    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
                }
            }
        });
    });
    //Close open tab when entering in the menu
    $(document).on( 'mouseenter','#top-menu', function(){
        $(this).find('.collapse .show').removeClass('show');
    });