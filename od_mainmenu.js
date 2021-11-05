
// TODO load this file if not loaded with theme

/*import $ from 'jquery';*/

const categories_displayed = [1];
var category;
var request;

window.innerWidth > 767 ? is_mobile = 0 : is_mobile = 1;

    window.onresize = function(){
        window.innerWidth > 767 ? is_mobile = 0 : is_mobile = 1;
        if(!is_mobile){
            //Remove arrows in desktop version
            $('span.nav-link').removeClass('show');
            $('span.nav-link').addClass('hidden');
            $('div.item-header[aria-expanded="true"]').attr('aria-expanded','false');
        }
        else{
            //Add arrows and clean subcategories opened in desktop version
            $('span.nav-link').removeClass('hidden');
            $('span.nav-link').addClass('show');
            $('div[data-toggle="collapse"]').addClass('collapsed');
            $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
            $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
        }
    }

    //Refresh submenu in desktop
    $(document).on('mouseover', "ul[data-depth='2'] li", function() {
        if(!is_mobile){
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

    function generateMenu(){

        let selected_cat = $(this);
        let id_category = parseInt(selected_cat.attr('id').match(/\d+/g)[0]);
        let depth = parseInt(selected_cat.find('.nav-link').data('depth'));
        
        if(categories_displayed.includes(id_category)){
            if(request && !is_mobile){  
                request.abort();
            }
            return;
        }
        //Avoid calls for fast mouse movements in desktop
        if(category == id_category){
            return;
        }
        if(request && !is_mobile){
            request.abort();
        }
        if(is_mobile){
            category = id_category;
        }

        request = $.ajax({
            url: prestashop.modules.od_mainmenu.endpoint,
            data: {
                ajax: true,id_category,depth,
            },
            success: function(data){
                if(!is_mobile){
                    category = id_category;
                }
                //empty, parents without childs don't insert anything
                categories_displayed.push(id_category);
                if(data.replace(/\s/g,"") == ""){
                    return;
                }

                selected_cat.find('div:last-child').append(data);
                //Mobile smooth animation requires an height based on number of childs
                if(is_mobile){
                    childs = selected_cat.find('div > ul > li').length;
                    selected_cat.find('div:nth-child(2)').first().css('height',(childs*41)+'px');
                }

                if(!is_mobile){
                    //Desktop, cleans the elements with depth=3 when inserted
                    selected_cat.find('.collapse').addClass('show');
                    if(depth === 2){
                        $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
                        $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
                    }
                }
            }
        });
    }
    //refresh desktop menu when re-entering
    $(document).on( 'mouseenter','#_desktop_header-menu', function(){
        $(this).find('.collapse .show').removeClass('show');
    });
    
    $(document).on( 'mouseenter','.category', function(){
        if(!is_mobile){
            generateMenu.call(this);
        }
    });
    $(document).on( 'click','.category', function(){
        if(is_mobile){
            //refresh mobile menu styles
            $('#_mobile_header-menu').find('.underline').removeClass('underline');
            $(this).find('.hidden').removeClass('hidden');
            generateMenu.call(this);
        }
    });