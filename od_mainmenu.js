
// TODO load this file if not loaded with theme

/*import $ from 'jquery';*/

$(function () {
    // Ocultar todos los elementos en depth=3 (limpiar el submenu)
    
    $("ul[data-depth='2']").on('mouseover', ' li', function() {
const categories_displayed = [1];
var category;
var request;
var mobile = 0;

function checkMobile(width){
        width > 768 ? mobile = 0 : mobile = 1;
    }


    $(document).on('mouseover', "ul[data-depth='2'] li", function() {
        checkMobile(window.innerWidth);
        if(!mobile){
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
        }
        });

    $(document).on( 'mouseenter','.category', function(){
        checkMobile(window.innerWidth);

        let selected_cat = $(this);
        let id_category = parseInt(selected_cat.attr('id').match(/\d+/g)[0]);  
        let depth = parseInt(selected_cat.find('.nav-link').data('depth'));
        
        if(categories_displayed.includes(id_category)){
            return;
        }
        //Avoid calls for fast mouse movements
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

                mobile === 1 ? selected_cat.find('div:last-child').addClass('show') : selected_cat.find('.collapse').addClass('show');

                selected_cat.find('div:last-child').append(data);
            }
        });
    });
    //Close open tab when entering in the menu
    $(document).on( 'mouseenter','#top-menu', function(){
        $(this).find('.collapse .show').removeClass('show');
    });