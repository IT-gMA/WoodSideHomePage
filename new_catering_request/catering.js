const CARD_CHILDREN_WIDTH_FACTOR = 0.25;
const _CART_BUTTON = $('div[name=shopping-cart-button]');
let MY_CART = [];
let is_cart_btn_dragged = false;
let screen_width = window.innerWidth;
let screen_height = window.innerHeight;
const BUTTON_LOADING_SPINNER = `<div style='position: relative; 
                                            display: flex;
                                            align-items: center !important;
                                            justify-content: center !important;
                                            width:100% !important; 
                                            padding: 0px !important; 
                                            margin: 0 !important;'>
                                    <div style='position: relative;
                                                display: flex !important;
                                                align-items: center !important;
                                                justify-content: center !important;
                                                max-width: 2.5em; !important'>
                                        <img src='https://i.ibb.co/Vp2hJGW/loading-spinner.gif' style='position: relative; max-width:100%;'>
                                        <br>
                                    </div>
                                </div>`;
const USER_ID = '70acd4d5-2e15-4b48-9145-f4caf659eb31';                                

window.addEventListener('resize', function() {
    screen_width = window.innerWidth;
    screen_height = window.innerHeight;
  });
  
function _drag_element(elem){
    let initial_hrz_pos = 0, initial_vert_pos = 0, curr_hrz_pos = 0, curr_vert_pos = 0;
    elem.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        curr_hrz_pos = e.clientX;
        curr_vert_pos = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
    
      function elementDrag(e) {
        _CART_BUTTON.css('transition', 'none');
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        initial_hrz_pos = curr_hrz_pos - e.clientX;
        initial_vert_pos = curr_vert_pos - e.clientY;
        curr_hrz_pos = e.clientX;
        curr_vert_pos = e.clientY;
        // set the element's new position:
        //elem.style.bottom = _format_new_elem_vert_position(elem.offsetTop - initial_vert_pos);
        //elem.style.left = _format_new_elem_hrz_position(elem.offsetLeft - initial_hrz_pos);
        //elem.style.left = `${curr_hrz_pos * 100 / screen_width}vw`;
        console.log(curr_hrz_pos);
        elem.style.left = _format_new_elem_hrz_position(curr_hrz_pos);
        //elem.style.bottom = _format_new_elem_hrz_position(curr_vert_pos);
      }
    
      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
}

function _format_new_elem_vert_position(pos){
    const _pos_in_vh = pos * 100 / screen_height;
    return pos < 1.5 ? '1.5vh' : _pos_in_vh > 95 ? '95vh' : `${_pos_in_vh}vh`;
}

function _format_new_elem_hrz_position(pos){
    const _pos_in_vw = pos * 100 / screen_width;
    return _pos_in_vw < 1.5 ? '1.5vw' : _pos_in_vw > 92.5 ? '92.5vw' : `${_pos_in_vw}vw`;
}

_drag_element(document.getElementById('cart-btn-container'));

/*const date = new Date();
let _day = date.getDate();
let _month = date.getMonth() + 1;
let _year = date.getFullYear();*/

function _query_nth_week_of_the_month(){
    const today = new Date();
    const nth_week = parseInt(Math.ceil(today.getDate() / 7) - 1);
    //console.log(`Today is in week ${nth_week - 1} of the month.`);
    return nth_week < 1 ? 0 : nth_week > 3 ? 3 : nth_week;
}

function _toggle_card_swipe(nxt_btn, prev_btn, card_item, actual_width){
    let _prev_arrow = prev_btn.children().eq(0);
    let _next_arrow = nxt_btn.children().eq(0);

    prev_btn.attr('disabled', card_item.scrollLeft < 1);
    nxt_btn.attr('disabled', card_item.scrollLeft >= actual_width - 10);
}

function _render_card_swipe_btns(preview_item_card_menu_prev_btn_attr, preview_item_card_menu_nxt_btn_attr, prev_btn, nxt_btn ,preview_item_card_menu_div_attr, scroll_factor=null){
    const _item_cards_container = document.querySelectorAll(preview_item_card_menu_div_attr);
    const _item_card_prev_btn = document.querySelectorAll(preview_item_card_menu_prev_btn_attr);
    const _item_card_nxt_btn = document.querySelectorAll(preview_item_card_menu_nxt_btn_attr);
    _item_cards_container.forEach((card_item, index) => {
        let _container_dimension = card_item.getBoundingClientRect();
        let _sub_card_width = _container_dimension.width * (typeof scroll_factor == 'number' ? scroll_factor : CARD_CHILDREN_WIDTH_FACTOR);
        let _prev_arrow = prev_btn.children().eq(0);
        prev_btn.attr('disabled', true);
        let _next_arrow = nxt_btn.children().eq(1);
        const actual_width = card_item.scrollWidth - _container_dimension.width;

        _item_card_prev_btn[index].addEventListener('click', (e) => {
            // scroll left i.e decreasing the scroll width
            card_item.scrollLeft -= _sub_card_width;
            console.log(card_item.scrollLeft);
            _toggle_card_swipe(nxt_btn, prev_btn, card_item, actual_width);
        });
        _item_card_nxt_btn[index].addEventListener('click', (e) => {
            // scroll right i.e increasing the scroll width
            card_item.scrollLeft += _sub_card_width;
            console.log(card_item.scrollLeft);
            _toggle_card_swipe(nxt_btn, prev_btn, card_item, actual_width);
        });
    });
}

function _render_weekly_menu(weekly_menu_json){
    // since the html for this special menu type has already been written in the calling html document
    // here only its corresponding menu type content is added
    const _foreground_markup = `<h1>${weekly_menu_json['title']}</h1><br>
                                <h6>${weekly_menu_json['sub-title']}</h6><br>
                                <a href='${weekly_menu_json['url']}'>
                                    <button type='button' class='btn btn-primary' name='explore-menu-btn' id='explore-menu-btn'>Explore now</button>
                                </a>`;
    $('div[name=weekly-specials-container]').find('.menu-desc').append(_foreground_markup);
    const _background_img_img_markup = "<img src='" + weekly_menu_json['img_url'] + "'>"
    $('div[name=weekly-specials-container]').find('.background-img-container').append(_background_img_img_markup);

    $('.weekly-menu-hero-img').append(`<img src='${weekly_menu_json['img_url']}'>`);
    $('.weekly-menu-hero-title').find('h1').empty();
    $('.weekly-menu-hero-title').find('h1').append(weekly_menu_json['title']);

    // render in page navigation menu
    $('div[name=in-page-nav-menu-container]').append(`<a href='${weekly_menu_json['url']}'>
                                                <div>
                                                    <img src='${weekly_menu_json['icon_url']}'>
                                                    <h6>${weekly_menu_json['icon_name']}</h6>
                                                </div>
                                            </a>`);
}

function _render_regular_menus(regular_menu_list){
    let _item_idx = 0;
    regular_menu_list.forEach((regular_menu) => {
        if (regular_menu['quick_card_menu'].length < 1){
            return;
        }
        const _html_name =  regular_menu['html_name'];
        const _containing_section = $('section[name=regular-item-menu-section]');
        // main section container
        const _quick_menu_display_name_attr = _html_name + '-quick-menu-display';
        const _quick_menu_display_name = 'name=' + _quick_menu_display_name_attr;

        // horizontal card menu container
        const _preview_item_card_menu_name_attr = _html_name + '-item-container-menu';
        const _preview_item_card_menu_name = 'name=' + _preview_item_card_menu_name_attr;
        const _preview_item_card_menu_div_attr = '[' + _preview_item_card_menu_name + ']';
        const _preview_item_card_menu_dom_div_name = 'div' + _preview_item_card_menu_div_attr;
        const _preview_item_card_menu_div = $(_preview_item_card_menu_dom_div_name);

        // individual menu item card
        const _preview_item_card_container_name_attr = _html_name + '-item-card';
        const _preview_item_card_container_name = 'name=' + _preview_item_card_container_name_attr;
        const _preview_item_card_container_attr = '[' + _preview_item_card_container_name + ']';
        const _preview_item_card_container_dom_div_name = 'div' + _preview_item_card_container_attr;
        const _preview_item_card_container = $(_preview_item_card_container_dom_div_name);

        // card navigation buttons
        const _preview_item_card_nxt_btn_name_attr = _html_name + '-swipe-next-btn';
        const _preview_item_card_nxt_btn_name = 'name=' + _preview_item_card_nxt_btn_name_attr;
        const _preview_item_card_menu_nxt_btn_attr = '[' + _preview_item_card_nxt_btn_name + ']';
        const _preview_item_card_menu_dom_nxt_btn_name = 'div' + _preview_item_card_menu_nxt_btn_attr;
        const _preview_item_card_menu_nxt_btn= $(_preview_item_card_menu_dom_nxt_btn_name);

        const _preview_item_card_prev_btn_name_attr = _html_name + '-swipe-prev-btn';
        const _preview_item_card_prev_btn_name = 'name=' + _preview_item_card_prev_btn_name_attr;
        const _preview_item_card_menu_prev_btn_attr = '[' + _preview_item_card_prev_btn_name + ']';
        const _preview_item_card_menu_dom_prev_btn_name = 'div' + _preview_item_card_menu_prev_btn_attr;
        const _preview_item_card_menu_prev_btn= $(_preview_item_card_menu_dom_prev_btn_name);

        // even indexed item will have hz-separating-line positioned on the left and right otherwise
        const _hz_separating_line = _item_idx % 2 == 0 ? "<hr class='hz-separating-line'>" : "<hr class='hz-separating-line' style='transform: translateX(-30%);'>";
        //console.log(_preview_item_card_container_name_attr);
        // construct main parent container for horizontal grid, nav buttons, separator and 'view-more' button
        let _markup = `<div class='quick-menu-display' id='quick-menu-${_html_name}' name='${_quick_menu_display_name_attr}'>`;
        // Descriptive texts
        _markup += `<h1>${regular_menu['title']}</h1>
                    <div class='menu-desc-text'>
                        <h6>${regular_menu['sub-title']}</h6>
                    </div><br>`;
        // render the horizontal card menu container
        _markup += _build_preview_menu(regular_menu['quick_card_menu'], _preview_item_card_container_name_attr, _preview_item_card_menu_name_attr, _html_name);
        // card swipe buttons
        _markup += `<div class='card-menu-swiper' name='card-menu-swiper'>
                        <button class='card-menu-swipe-btn' name='${_preview_item_card_prev_btn_name_attr}'>
                            <span class='material-symbols-outlined'>arrow_back_ios</span>
                        </button>
                        <button class='card-menu-swipe-btn' name='${_preview_item_card_nxt_btn_name_attr}'>
                            <span class='material-symbols-outlined'>arrow_back_ios</span>
                        </button>
                    </div><br>
                    <a href='${regular_menu['url']}'>       <!--Link to respective menu content page-->
                        <h5>View all</h5>
                    </a>
                </div>
                ${_hz_separating_line}<br><br>`; 
        // render this menu type content within the section
        $('section[name=regular-item-menu-section]').append(_markup);
        // construct card swiping functionality
        _render_card_swipe_btns(_preview_item_card_menu_prev_btn_attr, _preview_item_card_menu_nxt_btn_attr, _preview_item_card_menu_prev_btn, _preview_item_card_menu_nxt_btn, _preview_item_card_menu_div_attr);

        // render in page navigation menu
        $('div[name=in-page-nav-menu-container]').append(`<a href='#quick-menu-${_html_name}'>
                                                    <div>
                                                        <img src='${regular_menu['icon_url']}'>
                                                        <h6>${regular_menu['icon_name']}</h6>
                                                    </div>
                                                </a>`);
        _item_idx++;
    });
}

function _build_preview_menu(menu_items, preview_item_card_container_name_attr, preview_item_card_menu_name_attr, menu_type){
    // bottom hidden
    let _markup = `<div class='menu-item-container bottom hidden-animate snap-inline' name='${preview_item_card_menu_name_attr}'>`;

    // construct a card container for each item in this menu type
    menu_items.forEach((menu_item) => {
        menu_item['menu_type'] = String(menu_type);
        // for any item that has a metric of unit restriction
        const _min_quantity = !is_valid_digit(String(menu_item['min_quantity'])) ? 1 : parseInt(menu_item['min_quantity']) > 0 ? menu_item['min_quantity'] : 1;

        const _unit_metric_markup = menu_item['unit'] == null || menu_item['unit'] == 'Each' ? '<h6 hidden></h6>' : "<h6 style='font-size: 0.8em; padding: 1px;'>" + menu_item['unit'] + "</h6>";
        const _popup_remark = menu_item['notes'] != null && !is_whitespace(menu_item['notes']) ? 
        `<div class='dropdown dropup'>
            <a class='nav-link' id='item-info-dropdown-btn' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                <span class='material-symbols-outlined' id='info-icon'>info</span>
            </a>
            <ul name='item-info-drop-down' class='dropdown-menu' aria-labelledby='item-info-dropdown-btn' onclick='event.stopPropagation()' id='item-info-dropdown'>
                <div class='popup-content item-info-popup-content' name='popup-content'>
                    <h6>${menu_item['notes']}</h6>
                </div>
            </ul>
        </div>` : 
        `<div class='dropdown'>
        <a class='nav-link' id='item-info-dropdown-btn' role='button' data-bs-toggle='dropdown' aria-expanded='false' style='opacity: 0;'>
            <span class='material-symbols-outlined' id='info-icon'>info</span>
        </a>
        <ul hidden name='item-info-drop-down' class='dropdown-menu' aria-labelledby='item-info-dropdown-btn' onclick='event.stopPropagation()' id='item-info-dropdown'>
            <div class='popup-content item-info-popup-content' name='popup-content'>
                <h6>${menu_item['notes']}</h6>
            </div>
        </ul>
        </div>`;

        // construct the main card body container with its corresponding menu type name given
        _markup += `<div name='${preview_item_card_container_name_attr}' class='item-container'>
                        <p hidden name='item-id'>${menu_item['id']}</p>     <!--0-->
                        <div class='item-img-container'>                    
                            <img id='menu-item-thbn-img' src='${menu_item['img_url']}'>
                        </div>      <!--1-->
                        <!--Name/description and price-->
                        <div class='menu-item-desc'>
                            <h6 id='menu-item-title' class='menu-item-title'>${menu_item['name']}</h6>      <!--0-->
                            ${_unit_metric_markup}                                                          <!--1-->
                            <h6>$${parseFloat(menu_item['price']).toFixed(2)}</h6>                          <!--2-->
                            ${_popup_remark}                                                                <!--3-->
                        </div>      <!--2-->
                        <div class='item-input-container'>
                            <div>
                                <div>
                                    <span class='material-symbols-outlined circular' 
                                            name='reduce-quantity-btn'>remove</span>                <!--0-->                  
                                    <input name='item-quantity-input' 
                                            class='item-quantity-input' 
                                            placeholder='at least ${_min_quantity}'>                <!--1-->
                                    <span class='material-symbols-outlined circular' 
                                            name='add-quantity-btn'>add</span>                       <!--2-->
                                </div>                                                                      <!--0-->
                                <i class='input-err-msg'>Must be at least ${_min_quantity}</i>  <!--1-->
                                <p hidden name='min-item-quantity'>${_min_quantity}</p>         <!--2-->
                                <p hidden name='float-price'>${parseFloat(menu_item['price'])}</p>           <!--3-->
                            </div>
                        </div>      <!--3-->
                        <button disabled type='button' class='btn btn-primary' 
                                name='add-to-cart-btn' confirm='Are your sure?' 
                                id='add-to-cart-btn'>Add to cart
                        </button>   <!--4-->
                        <i hidden>${menu_item['menu_type']}</i>     <!--5-->
                        <h6 hidden>${menu_item['notes']}</h6>       <!--6-->
                        <h6 hidden>${menu_item['menu_type_frk']}</h6>       <!--7-->
                        <h6 hidden>${menu_item['menu_section']}</h6>       <!--8-->
                        <h6 hidden>${menu_item['menu_type_id']}</h6>       <!--9-->
                    </div>`;
    });
    _markup += "</div><br>";
    return _markup
}

function disable_individual_btn(btn, valid_cond){
    //console.log(btn);
    btn.attr('disabled', !valid_cond);
}

function _quick_ui_styling(){
    // styling minor elements
    $('.input-err-msg').css('color', 'transparent');
    // rotate each next nav arrow icon 180º i.e make it point to the right
    $('div[name=card-menu-swiper]').each(function() {$(this).children().eq(1).children().eq(0).css('transform', 'rotate(180deg)');});
    // adjust each menu item's title/name a bold font weight
    $('.menu-item-desc').each(() => $(this).children().eq(0).css('font-weight', 'bold'));
}

function _render_animation(){
    // Animation control
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {entry.isIntersecting ? entry.target.classList.add('show-animate') : entry.target.classList.remove('show-animate');});
    });
    document.querySelectorAll('.hidden-animate').forEach((elem) => {observer.observe(elem);});
}

function _insert_user_cart_table(cart_item){
    $.ajax({
        type: 'POST',
        url: 'https://prod-26.australiasoutheast.logic.azure.com:443/workflows/779a6d6f7b494f7a8cd90edd02613794/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=InKgiyYo3AIjM5sPr4o12uL_neRc7MSG8zg7rC7T6LE',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            'tenant_id': USER_ID,
            'cart_item': cart_item['id'],
            'quantity': cart_item['ordered_quantity'],
            'catering_menu': cart_item['menu_type_id'],
            'menu_type': cart_item['menu_type']
        }),
        complete: function (response){
            console.log(response.status);
            if (![200].includes(response.status)) return alert('Failed add new item at this time');
            alert(`${cart_item['ordered_quantity']} of ${cart_item['name']} has been added to your shopping cart`);
            MY_CART.push(cart_item);

            _process_num_cart_items();
        },
        /*success: function (response, status, xhr){
            console.log(status)
            if (![200].includes(status)) return alert('Failed add new item at this time');
            _process_num_cart_items();
            console.log(response);
            alert(`${_selected_quantity} of ${_item_name} has been added to your shopping cart`);
            MY_CART.push(new_cart_item);
        },*/
        /*error: function(response){
            alert('Failed add new item at this time');
        },*/
    });
}

function _add_to_cart(item_name, item_id, menu_type, menu_type_id, menu_section, item_price, selected_quantity){
    let _matched_item = null;
    // check whether this item already exists in the cart
    MY_CART.forEach(function(cart_item){
        if (cart_item['id'] == item_id && cart_item['name'] == item_name && cart_item['menu_type_id'] == menu_type_id && cart_item['menu_section'] == menu_section){
            _matched_item = cart_item;
            cart_item['ordered_quantity'] += selected_quantity;
            cart_item['total_price'] += parseFloat(parseInt(selected_quantity) * parseFloat(item_price));
            cart_item['last_modified'] = new Date();
        }
    });
    if (_matched_item != null){
        // existing item has already been added above thus making the variable _matched_item not null -> halts the function
        return;
    }
    // this item doesn't exist in the cart
    const new_cart_item = {
        'id': item_id,
        'name': item_name,
        'price': parseFloat(item_price),
        'menu_type': menu_type,
        'menu_type_id': menu_type_id,
        'menu_section': menu_section,
        'ordered_quantity': parseInt(selected_quantity),
        'total_price': parseFloat(parseInt(selected_quantity) * parseFloat(item_price)),
        'last_modified': new Date(),
    };
    _insert_user_cart_table(new_cart_item);
}

function _process_num_cart_items(){
    //const sum_item_quantity = MY_CART.reduce((accumulator, _v) => {return accumulator + _v.ordered_quantity;}, 0);
    const sum_item_quantity = MY_CART.length;
    _CART_BUTTON.children('[name=cart-item-num]').text(sum_item_quantity > 99 ? '99+' : String(sum_item_quantity));
}

function _render_body_content(){
    $.ajax({
        type: 'POST',
        url: 'https://prod-04.australiasoutheast.logic.azure.com:443/workflows/389d03ade6b84ee9807722164d89d6e0/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pEONyZeLFfJNLAG8enF7uEJddG5hL70KVQuIsgM90uo',
        contentType: 'application/json',
        accept: 'application/json;odata=verbose',
        success: function (response1, status1, xhr1){
            let _menu_items = [];
            console.log(response1.value);
            response1.value.forEach(function(menu_item){
                _menu_items.push({
                    'id': menu_item.prg_cateringitemid,
                    'name': menu_item.prg_cateringitemdescription,
                    'price': menu_item.prg_priceperunit,
                    'min_quantity': menu_item.prg_minimumorderquantity,
                    'img_url': menu_item.crcfc_img_url,
                    'unit': menu_item.prg_unit,
                    'notes': menu_item.prg_notes,
                    'menu_type_frk': menu_item.prg_menutype,
                    'menu_section': menu_item.prg_menusection,
                    'shown_in_preview': menu_item.crcfc_show_in_preview,
                });
            });
            //_menu_items.forEach((v) => console.log(v));
            $.ajax({
                type: 'POST',
                url: 'https://prod-00.australiasoutheast.logic.azure.com:443/workflows/0f48026bd06a4dccb978cdb25c138528/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NLP_gSS9EekQLAyCuYFQL5h_v22E5rprksKLL69ubdA',
                contentType: 'application/json',
                accept: 'application/json;odata=verbose',
                success: function (response, status, xhr){
                    const _catering_menu_dict = {};
                    const _keyMap = {  crcfc_is_regular_menu: 'is_regular_menu', 
                                        crcfc_is_emergency: 'is_emergency',
                                        prg_cateringmenuid: 'id',
                                        prg_menutype: 'name',
                                        crcfc_html_name: 'html_name',
                                        crcfc_title: 'title',
                                        crcfc_subtitle: 'sub-title',
                                        crcfc_corresponding_url: 'url',
                                        crcfc_img_url: 'img_url',
                                        crcfc_svg_icon_url: 'icon_url',
                                        crcfc_icon_name: 'icon_name',
                                    };
                    let _menu_types = response.value.map(menu_type => 
                                            Object.fromEntries(
                                                Object.entries(menu_type).map(([key, value]) => 
                                                                                [_keyMap[key] || key, value])
                                            ));
                    _menu_types.forEach(function(menu_type){
                        _catering_menu_dict[`${menu_type['id']}`] = menu_type['name'];
                        menu_type['quick_card_menu'] = _menu_items.filter(menu_item => (String(menu_item.menu_type_frk).trim() == String(menu_type.name).trim() && menu_item.shown_in_preview));
                        menu_type['quick_card_menu'].forEach((menu_item) => menu_item['menu_type_id'] = menu_type['id']);
                    });                          

                    let _weekly_menus = _menu_types.filter(menu_type => !menu_type['is_regular_menu'] && !menu_type['is_emergency']);
                    _weekly_menus.sort((a, b) => a.name.localeCompare(b.name));
                    let _regular_menus = _menu_types.filter(menu_type => menu_type['is_regular_menu'] && !menu_type['is_emergency']);
                    _regular_menus.sort((a, b) => a.name.localeCompare(b.name));
                    let _priority_menus = _menu_types.filter(menu_type => !menu_type['is_regular_menu'] && menu_type['is_emergency']);
                    _priority_menus.sort((a, b) => a.name.localeCompare(b.name));

                    _render_weekly_menu(_weekly_menus[_query_nth_week_of_the_month()]);
                    _render_regular_menus(_regular_menus);
                    _render_regular_menus(_priority_menus);


                    $.ajax({
                        type: 'POST',
                        url: 'https://prod-01.australiasoutheast.logic.azure.com:443/workflows/1896be5cf2c34e59bdad0c3a17cc4414/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=YRyamaJ-ffJQwasjPU_SXR5QzGFFLoFnrEJ8tT1OTi4',
                        contentType: 'application/json',
                        accept: 'application/json;odata=verbose',
                        success: function (response, status, xhr){

                        }
                    });

                    _quick_ui_styling();
                    // render document animations
                    _render_animation();
                    // render shopping cart
                    _process_num_cart_items();

                    _ready_page_for_contents();
                    document.querySelectorAll('[name=top-nav-prev]').forEach((e) => {console.log(e)});
                    _render_card_swipe_btns('[name=top-nav-prev]', '[name=top-nav-nxt]', $('span[name=top-nav-prev]'), $('span[name=top-nav-nxt]'), '[name=in-page-nav-menu-container]', 0.2);
                },
            });
        }
    });
}

function _ready_page_for_contents(){
    //Unhide on successful resources loading
    $('.menu-offer-section').each(function(e){
        $(this).show();
    });
    // Hide loading spinner on successful resources loading
    $('.loading-spinner').css('display', 'none');

    //Unhide on successful resources loading
    $('div[name=shopping-cart-button], .in-page-nav-menu, .in-page-top-nav-menu, .notice-container, .menu-offer-section').css('opacity', '1');
}

function _hide_elements_on_load(){
    // Hidden element before loading resources
    $('div[name=shopping-cart-button], .in-page-nav-menu, .in-page-top-nav-menu, .notice-container, .menu-offer-section').css('opacity', '0');
    $('.menu-offer-section').each(function(e){
        $(this).hide();
    });
    //$('.in-page-nav-menu').hide();
}


function prepare_cart_table_update(input_dom, cart_btn, complete=false){
    const _parent_div = input_dom.closest('.item-input-container');
    const _add_btn = _parent_div.find('[name=add-quantity-btn]');
    const _reduce_btn = _parent_div.find('[name=reduce-quantity-btn]');
    if (!complete){
        [_add_btn, _reduce_btn, input_dom, cart_btn].forEach((elem) => elem.attr('disabled', true));
        cart_btn.empty();
        //cart_btn.append(BUTTON_LOADING_SPINNER);
        cart_btn.append('Processing...');
    }else{
        [_add_btn, _reduce_btn, input_dom].forEach((elem) => elem.attr('disabled', true));
        input_dom.val(null);
        cart_btn.empty();
        cart_btn.append('Add to cart');
    }
}

$(document).ready(function () {
    _hide_elements_on_load();
    _render_body_content();
    $(document).on('keyup', 'input[name=item-quantity-input]', function (e) {
        //!DIGIT_REGEX.test($(this).val()) ? $(this).val(null) : null;
        !DIGIT_REGEX.test($(this).val()) ? $(this).val(extract_integers($(this).val())) : null;

        const _valid_digit = is_valid_digit($(this).val());
        //console.log(_valid_digit);
        const _parent_div = $(this).parent().parent();

        if ($(this).val() && _valid_digit){
            _parent_div.children().eq(1).css('color', `${parseInt($(this).val()) >= parseInt(_parent_div.children().eq(2).text()) ? 'transparent' : 'red'}`);
        }else{
            _parent_div.children().eq(1).css('color', `${_valid_digit || !$(this).val() ? 'transparent' : 'red'}`);
        }
        disable_individual_btn(_parent_div.parent().parent().children().eq(4), _valid_digit && parseInt($(this).val()) >= parseInt(_parent_div.children().eq(2).text()));
    });

    $(document).on('click', 'span[name=add-quantity-btn], span[name=reduce-quantity-btn]', function(e){
        const _this_name_attr = String($(this).attr('name'));
        const _input_field = $(this).parent().children().eq(1);
        let _valid_digit = is_valid_digit(!_input_field.val() ? 'none' : _input_field.val());
        if (!_valid_digit){
            _input_field.val(extract_integers(_input_field.val()));
            //_input_field.val(null);
        }
        let _curr_quantity = _input_field.val();
        const _min_quantity = parseInt($(this).parent().parent().children().eq(2).text());
        /*console.log(_this_name_attr);
        console.log(_input_field.val());
        console.log(_min_quantity);*/
        if (!_input_field.val()){
            _this_name_attr == 'add-quantity-btn' ? _input_field.val(_min_quantity) : null;
            _curr_quantity = parseInt(_input_field.val());
        }else{
            _curr_quantity = parseInt(_input_field.val());
            _this_name_attr == 'add-quantity-btn' ? _curr_quantity++ :  _curr_quantity < _min_quantity ?  _curr_quantity = null : _curr_quantity -= 1;
            if ( _this_name_attr == 'add-quantity-btn' && _curr_quantity < _min_quantity){
                _curr_quantity = _min_quantity;
            }
            _input_field.val(_curr_quantity);
            _input_field.parent().parent().children().eq(1).css('color', `${_curr_quantity >= _min_quantity || _curr_quantity == null ?  'transparent' : 'red'}`);
        }
        _valid_digit = is_valid_digit(_input_field.val());
        disable_individual_btn($(this).parent().parent().parent().parent().children().eq(4), _valid_digit && parseInt(_input_field.val()) >= _min_quantity);
    });

    $(document).on('click', 'button[name=add-to-cart-btn]', function(e) {
        const _parent_div = $(this).parent();
        const _input_div = _parent_div.children().eq(3).children().eq(0);
        prepare_cart_table_update(_input_div.find('.item-quantity-input'), $(this));

        const _selected_quantity = extract_integers(_input_div.find('.item-quantity-input').val());
        if (_selected_quantity == null) return;
        const _item_id = _parent_div.children().eq(0).text();
        const _item_name = _parent_div.children().eq(2).children().eq(0).text();
        const _menu_type = _parent_div.children().eq(7).text();
        const _menu_type_id = _parent_div.children().eq(9).text();
        const _menu_section = _parent_div.children().eq(8).text();
        const _item_price = parseFloat(_input_div.children().eq(3).text());

        //console.log(_selected_quantity);
        //console.log(_item_name);
        _add_to_cart(_item_name, _item_id, _menu_type, _menu_type_id, _menu_section, _item_price, _selected_quantity);
        // clear existing inputs
        MY_CART.forEach((cart_item) => {console.log(cart_item)});
        prepare_cart_table_update(_input_div.find('.item-quantity-input'), $(this), true);
    });
});