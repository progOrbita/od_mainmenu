
// TODO load this file if not loaded with theme

/*import $ from 'jquery';*/

const categories_displayed = [];
const index = $(document).find('#category-1');
var category;
var request;

window.innerWidth > 767 ? is_mobile = 0 : is_mobile = 1;

/**
* Obtains the id of the category from the DOM element
* @param {Object} element 
* @returns id of category id
*/

function getCategoryId(element){
    return parseInt(element.attr('id').match(/\d+/g)[0]);
}
function refreshSubmenu(){
    $('#top-menu').find('.underline').removeClass('underline');
    // Hide all the elements in depth=3 (cleans the submenu)
    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().removeClass('show');
    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
}
    window.onresize = function(){
        window.innerWidth > 767 ? is_mobile = 0 : is_mobile = 1;
        if(!is_mobile){
            //Desktop, remove arrows
            $('span.nav-link').removeClass('show');
            $('span.nav-link').addClass('hidden');
            $('div.item-header[aria-expanded="true"]').attr('aria-expanded','false');
            if($('#top-menu').find('div').css('height') != null){
                $('#top-menu').find('div').css('height','');
            }

        }
        else{
            //Mobile, add arrows and removes subcategories opened
            $('span.nav-link').removeClass('hidden');
            $('span.nav-link').addClass('show');
            $('div[data-toggle="collapse"]').addClass('collapsed');
            $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
            $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
        }
    }
    
    /**
     * Obtain and append the childs to the category selected
     * @param {int} index Root category id
     * @returns void
     */
    function generateMenu(index){
        let selected_cat;
        index ? selected_cat = index : selected_cat = $(this);

        let id_category = getCategoryId(selected_cat);
        let category_depth = parseInt(selected_cat.find('.nav-link').data('depth'));
        
        if(categories_displayed.includes(id_category)){
            if(request && !is_mobile){  
                request.abort();
            }
            return;
        }
        //Avoid calls for fast clicks
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
                ajax: true,id_category,category_depth,
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
                    if(category_depth !== 0){
                        selected_cat.find('div:nth-child(2)').first().css('height',(childs*41)+'px');
                    }
                }
            }
        });
    }
    $(document).on('mouseover', "ul[data-depth='2'] li", function() {
        if(!is_mobile){
            refreshSubmenu();
            //Add an underline to the submenu selected
            $(this).find('.item-header > a[data-depth="2"]').toggleClass('underline');
            // Shows only the children of the element where we stood
            if(this.children[1]) {
                $(this).find("ul[data-depth='3']").parent().removeClass('hidden');
                $(this).find("ul[data-depth='3']").parent().attr('aria-expanded', true);
            }
        }
    });
    $(document).on('mouseleave', "div.collapse .show", function() {
        request.abort();
        refreshSubmenu();
    });
    //refresh desktop menu when re-entering
    $(document).on( 'mouseenter','#_desktop_header-menu', function(){
        $(this).find('.collapse .show').removeClass('show');
    });
    $(document).on( 'mouseleave','#_desktop_header-menu', function(){
        $(this).find('div[aria-expanded="true"]').attr('aria-expanded',false);
    });
    
    $(document).on( 'mouseenter','.category', function(){
        if(!is_mobile){
            generateMenu.call(this);
            let selected_depth = parseInt($(this).find('.nav-link').data('depth'));
            //classes for 'home' tab childs, theme doesnt work because is inserted when DOM is already up.
            if(selected_depth === 1){
                $(this).find('div:nth-child(1)').first().removeClass('collapsed');
                $(this).find('div:nth-child(1)').attr('aria-expanded',true);
                $(this).find('div:nth-child(2)').first().addClass('show');
            }
        }
    });
    $(document).on( 'mouseleave','.category', function(){
        let selected_depth = parseInt($(this).find('.nav-link').data('depth'));
        if(!is_mobile && selected_depth === 1){
            $(this).find('div:nth-child(1)').first().addClass('collapsed');
            $(this).find('div:nth-child(1)').attr('aria-expanded',false);
            $(this).find('div:nth-child(2)').first().removeClass('show');
        }
        //avoid menu generation if exit the tab
        let id_root = getCategoryId(index);
        if(!categories_displayed.includes(id_root)){
            request.abort();
        }
    });
    //generate menu for mobile version
    $(document).on( 'click','.menu-icon', function(){
        generateMenu(index);
    });
    $(document).on( 'click','.category', function(){
        if(is_mobile){
            //refresh mobile menu styles
            $('#_mobile_header-menu').find('.underline').removeClass('underline');
            $(this).find('.hidden').removeClass('hidden');
            generateMenu.call(this);
        }
    });