
// TODO load this file if not loaded with theme

/*import $ from 'jquery';*/

const categories_displayed = [];
const index = $(document).find('#category-1');
var category;
var request;
    //default max width for mobile limited by prestashop
var minWidth = 768;

window.innerWidth >= minWidth ? is_mobile = 0 : is_mobile = 1;

/**
* Obtains the id of the category from the DOM element
* @param {Object} element 
* @returns id of category id
*/

function getCategoryId(element){
    return parseInt(element.attr('id').match(/\d+/g)[0]);
}

/**
* Refresh submenu by removing the underline and hiding the submenus opened
* @returns void
*/

function refreshSubmenu(){
    $('#top-menu').find('.underline').removeClass('underline');
    // Hide all the elements in depth=3 (cleans the submenu)
    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().removeClass('show');
    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
    $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
}

    window.onresize = function(){

        window.innerWidth > minWidth ? is_mobile = 0 : is_mobile = 1;
        if(!is_mobile){
            //Desktop, hide arrows and reset opened menu
            $('span.nav-link').removeClass('show');
            $('span.nav-link').addClass('hidden');
            $('div.item-header[aria-expanded="true"]').attr('aria-expanded','false');
        }
        else{
            //Mobile, show arrows and removes subcategories opened
            $('span.nav-link').removeClass('hidden');
            $('span.nav-link').addClass('show');
            $('div[data-toggle="collapse"]').addClass('collapsed');
            $("ul[data-depth='2']").find("ul[data-depth='3']").parent().addClass('hidden');
            $("ul[data-depth='2']").find("ul[data-depth='3']").parent().attr('aria-expanded', false);
        }
    }
    
    /**
     * Obtain and append the childs to the category selected
     * @param {int} index li DOM element of root category
     * @returns void
     */
    function generateMenu(index){
        let selected_cat;
        //index exist only when clicked on mobile icon
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
        //Mobile can have various calls at same time
        if(request && !is_mobile){
            request.abort();
        }
        //Mobile version, assign before the request to avoid the ajax call.
        if(is_mobile){
            category = id_category;
        }

        request = $.ajax({
            url: prestashop.modules.od_mainmenu.endpoint,
            data: {
                ajax: true,id_category,category_depth,
            },
            success: function(data){
                //After the call because is aborted if exit from selected category and can't duplicate the calls.
                //If is added outside the request it would need to select a category not added before a new attempt
                if(!is_mobile){
                    category = id_category;
                }
                //empty field are parents without childs, so it doesn't nned to insert text
                categories_displayed.push(id_category);
                if(data.replace(/\s/g,"") == ""){
                    return;
                }
                //Childs are appended to the last div of the parent (top_sub_menu)
                selected_cat.find('div:last-child').append(data);
                //Mobile smooth animation requires an height based on number of childs
                if(is_mobile){
                    childs = selected_cat.find('div > ul > li').length;
                    if(category_depth !== 0){
                        selected_cat.find('div:nth-child(2)').first().css('height',(childs*41)+'px');
                    }
                }
                if(is_mobile === 0){
                    //Desktop, hide arrows and reset height from submenus
                    $('span.nav-link').removeClass('show');
                    $('span.nav-link').addClass('hidden');
                }
            }
        });
    }

    //Refresh submenu in desktop
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
    /**
     * Desktop. Sub-categories from second menu. When exit hide submenus, remove underline and stop the current request
     */
    $(document).on('mouseleave', "div.collapse .show", function() {
        if(!is_mobile){
            request.abort();
            refreshSubmenu();
        }
    });
    
    //Desktop, cleans menu when re-entering.
    //Mobile to desktop clean marked categories
    $(document).on( 'mouseleave','#_desktop_header-menu', function(){
        $(this).find('.collapse .show').removeClass('show');
        $(this).find('div[aria-expanded="true"]').attr('aria-expanded',false);
    });

    //Desktop, generate childs. Also shows the categories from selected menu category (discount, satellite, receivers...)
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
        //remove height style from mobile animation
        if($('#top-menu').find('div').css('height') != null){
            $('#top-menu').find('div').css('height','');
        }
    });
    //Desktop, hide category selected from menu when exit.
    $(document).on( 'mouseleave','.category', function(){
        let selected_depth = parseInt($(this).find('.nav-link').data('depth'));
        if(!is_mobile && selected_depth === 1){
            $(this).find('div:nth-child(1)').first().addClass('collapsed');
            $(this).find('div:nth-child(1)').attr('aria-expanded',false);
            $(this).find('div:nth-child(2)').first().removeClass('show');
        }
        //avoid menu generation if exit the box
        let id_root = getCategoryId(index);
        if(!categories_displayed.includes(id_root)){
            request.abort();
        }
    });
    //generate menu for mobile version
    $(document).on( 'click','.menu-icon', function(){
        generateMenu(index);
    });
    //Desktop to mobile, refresh childs from current category style and generate the childs. For level-depth - 3
    $(document).on( 'click','.category', function(){
        if(is_mobile){
            $(this).find('.hidden').removeClass('hidden');
            generateMenu.call(this);
        }
    });