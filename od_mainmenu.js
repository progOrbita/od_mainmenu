
// TODO load this file if not loaded with theme

/*import $ from 'jquery';*/

$(function () {
    // Ocultar todos los elementos en depth=3 (limpiar el submenu)
    
    $("ul[data-depth='2']").on('mouseover', ' li', function() {
const categories_displayed = [1];
var category;
var request;
var mobile = 0;
var width = window.innerWidth;
console.log(width);
if(width < 768){
    mobile = 1;
}
    if(!mobile){
        $(document).on('mouseover', "ul[data-depth='2'] li", function() {

            //Add an underline to the submenu selected
            $('#top-menu').find('.underline').removeClass('underline');
            $(this).find('.item-header > a[data-depth="2"]').addClass('underline');

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
    }

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
        category = id_category;

        if(request){
            request.abort();
        }
        request = $.ajax({
            url: prestashop.modules.od_mainmenu.endpoint,
            data: {
                ajax: true,id_category,depth,
            },
            success: function(data){
                //empty, parents without childs.
                if(data.replace(/\s/g,"") == ""){
                    return;
                }
                categories_displayed.push(id_category);

                //Append to the end of the div
                selected_cat.find('.collapse').append(data);
                selected_cat.find('.collapse').addClass('show');
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