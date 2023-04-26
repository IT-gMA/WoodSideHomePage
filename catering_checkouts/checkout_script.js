// retrieve user id
function get_user_id(){
    const elem_user_id = '{{user.id}}';
    return elem_user_id.includes('{{') && elem_user_id.includes('}}') ? 'bb7c040e-85da-ed11-a7c7-000d3acb5309' : elem_user_id;
}
const USER_ID = get_user_id(); 

let SITE_LOCATIONS = [];
let MY_CART = [];

let valid_dt = {
    'valid_function_datetime': false,
    'valid_weekly_datetime': false,
    'valid_consumable_datetime': false,
    'valid_priority_datetime': false,
}

const menu_type_dt_map = {
    'weekly': ['baba4017-5f64-ed11-9561-0022489624ee', 'cO9ecc2d-f29c-ed11-aad1-002248114fd7', 'c19ecc2d-f29c-ed11-aad1-002248114fd7', 'c29ecc2d-f29c-ed11-aad1-002248114fd7'],
    'consumable': ['85f8652d-5f64-ed11-9561-000d3acc166b'],
    'function': ['674bdf21-5f64-ed11-9561-0022489334d1', 'db7c2127-564-ed11-9561-002248933ec4', '83158147-85cf-ed11-a7c7-002248117628'],
    'priority': ['fe298b2a-5f64-ed11-9561-000d3aca76e9'],
}

let valid_request_title = false;
let selected_site_location = null;
let selected_site_location_name = null;
let valid_phonenum = false;
let valid_name = false;
let valid_email = false;
let valid_cost_code = false;
let valid_building = false;

const _datetime_input = $('input[name=datetime-input]');
const FORM_DOM = $('form[name=service-request-form]');
const INSET_BOX_SHADOW_BOTTOM = 'inset 0px -25px 20px -20px rgba(0, 0, 0, 0.2)';
const INSET_BOX_SHADOW_TOP  = 'inset 0px 25px 20px -20px rgba(0, 0, 0, 0.2)';
const MOBILE_SCREEN_WIDTH = 780;
const MODAL_ACTIVATE_ELEMS = 'span[name=site-location-content]';
const BUTTON_LOADING_SPINNER = `<div style='width:100%; padding: 0; margin: 0;'>
                                    <div style='display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                max-width: 2.5em;'>
                                        <img src='https://i.ibb.co/Vp2hJGW/loading-spinner.gif' style='max-width:100%;'>
                                    </div>
                                </div>`;

const PLACEHOLDER_IMG_URL = 'https://i.ibb.co/VMPPhzc/place-holder-catering-item-img.webp';

function _append_cart_item(cart_item){
    $('div[name=cart-menu-table]').append(`<div class='cart-item-info-container'
                                    name='cart-item-info-container'
                                    data-cartid='${cart_item['cart_id']}' 
                                    data-cateringitem='${cart_item['id']}' 
                                    data-cateringmenu='${cart_item['menu_type_id']}'
                                    data-menusection='${cart_item['menu_section']}'
                                    data-totalprice='${cart_item['total_price']}'
                                    data-price='${cart_item['price']}'
                                    data-quantity='${cart_item['ordered_quantity']}'
                                    data-minquantity='${cart_item['min_quantity']}'
                                    data-cateringmenuname="${cart_item['menu_type']}">
                                <div class='img-container cart-item'>
                                    <img src='${cart_item['img_url']}'>
                                </div>          <!--0-->
                                <div class='cart-item-info-content'>
                                    <div class='cart-item-info-content-inner'>
                                        <div class='cart-item-desc-content'>
                                            <h5 class='to-be-searched-data' name='cart-item-name'>${cart_item['name']}</h5>
                                            <h6>
                                                ${cart_item['menu_type']}<br>
                                                ${cart_item['menu_section']}
                                            <h6>
                                            <p>$${parseFloat(cart_item['price']).toFixed(2)} - ${cart_item['unit']}</p>
                                        </div>          <!--0-->
                                    </div>

                                    <div class='cart-item-price-content'>      
                                        <h6 name='single-item-total-price-msg'>$${parseFloat(cart_item['total_price']).toFixed(2)}</h6>     <!--0-->
                                        <div>                            
                                            <span class='material-symbols-outlined circular' name='reduce-quantity-btn'  data-fromcart='1'>remove</span>   <!--0-->                  
                                                <input name='item-quantity-input'   data-minquantity='${cart_item['min_quantity']}'     data-fromcart='1'
                                                        class='item-quantity-input' placeholder='at least ${cart_item['min_quantity']}' 
                                                        value='${cart_item['ordered_quantity']}' data-fromcart='1' data-isvalid='1'>     <!--1-->
                                                    <span class='material-symbols-outlined circular' name='add-quantity-btn'  data-fromcart='1'>add</span>          <!--2-->
                                            </div>     <!--1-->
                                        </div>       <!--1-->
                                    </div>
                                </div>`);
}

function compose_cart_item_list(cart_items){
    let values = [];
    cart_items.forEach(function(cart_item){
        const cart_item_container = cart_item['cart_item_container'];
        const og_quantity = parseInt(cart_item_container.attr('data-quantity'));
        const min_quantity = parseInt(cart_item_container.find('data-minquantity'));
        let new_quantity = extract_integers(cart_item_container.find('[name=item-quantity-input]').val());
        if (new_quantity != og_quantity || new_quantity == null){
            // update when this item has new quantity changed to null or other than its og quantity
            let _updates = {
                            'tenant_id': USER_ID,
                            'cart_item': cart_item_container.attr('data-cateringitem'),
                            'quantity': cart_item.hasOwnProperty('is_removed') || new_quantity == null || new_quantity <= 0 || new_quantity < min_quantity ? 0 : new_quantity,
                            'catering_menu': cart_item_container.attr('data-cateringmenu'),
                            'menu_type': cart_item_container.attr('data-menusection'),
                            'cart_id': cart_item_container.attr('data-cartid'),
                        };
            //values.push(_updates);
            _updates['new_price'] = _updates['quantity']  * parseFloat(cart_item_container.attr('data-price'));
            cart_item['updates'] = _updates;
            values.push(_updates);
        }
    });
    return values;
}

function remap_cart_modal_table(cart_items){
    cart_items.forEach(function(cart_item){
        const cart_item_container = cart_item['cart_item_container'];
        const og_quantity = parseInt(cart_item_container.attr('data-quantity'));
        const min_quantity = parseInt(cart_item_container.attr('data-minquantity'));
        
        const _new_updates = cart_item['updates'];
        if (_new_updates == null) return;
        const _new_quantity = parseInt( _new_updates['quantity']);
        if (cart_item.hasOwnProperty('is_removed') || _new_quantity < min_quantity || _new_quantity == null) return cart_item_container.remove();

        cart_item_container.attr('data-quantity', _new_quantity);
        cart_item_container.attr('data-totalprice', _new_updates['new_price']);

        cart_item_container.find('[name=item-quantity-input]').val(_new_quantity);
        cart_item_container.find('[name=single-item-total-price-msg]').text(`$${parseFloat(_new_updates['new_price']).toFixed(2)}`);
    });
}

function multi_update_user_cart_table(cart_items){
    catering_cart_ajax_event();
    const cart_popup_modal = $('section[name=cart-menu-modal-container]');
    const values = compose_cart_item_list(cart_items);
    $.ajax({
        type: 'POST',
        url: 'https://prod-24.australiasoutheast.logic.azure.com:443/workflows/8b393c145e1749efb9d1a85dc57f54c3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=65Nh0tbsKkXj5pTOQ0nX3cVuPI68sJ5jDLphkgF0las',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({'value': values}),
        complete: function (response){
            if (![200].includes(response.status)) return alert('Failed to update cart at this time');

            remap_cart_modal_table(cart_items);
            _process_num_cart_items();
            //alert('Failed to update cart at this time');
            catering_cart_ajax_event(true);
            _recalculate_cart_subtotal(true);
        }
    });
}

function single_update_user_cart_table(cart_item, parent_div, input_div, cart_item_container){
    let _data_dict = {
        'tenant_id': USER_ID,
        'cart_item': cart_item['id'],
        'quantity': cart_item['ordered_quantity'],
        'catering_menu': cart_item['menu_type_id'],
        'menu_type': cart_item['menu_type'],
        //'cart_id': cart_item['cart_id'],
    }
    if (cart_item['cart_id'] != null) _data_dict['cart_id'] = cart_item['cart_id'];
    $.ajax({
        type: 'POST',
        url: 'https://prod-24.australiasoutheast.logic.azure.com:443/workflows/8b393c145e1749efb9d1a85dc57f54c3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=65Nh0tbsKkXj5pTOQ0nX3cVuPI68sJ5jDLphkgF0las',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({'value': [_data_dict]}),
        complete: function (response){
            console.log(response);
            prepare_cart_table_update(input_div.find('.item-quantity-input'), parent_div.find('[name=add-to-cart-btn]'), true);

            if (![200].includes(response.status)) return alert(`${cart_item['cart_id'] == null ? 'Failed add new item at this time' : 'Unable to add ' + cart_item['name']}`);

            alert(`${cart_item['input_quantity']} of ${cart_item['name']} has been added to your shopping cart`);
            if (cart_item['cart_id'] == null){
                cart_item['cart_id'] = response.responseJSON[0];    // assign to newly generated cart id
                _append_cart_item(cart_item);
            }else{
                let cart_item_updates = {
                    'cart_item_container': cart_item_container,
                    'updates': cart_item['ordered_quantity'] <= 0 ? null : {'quantity': cart_item['ordered_quantity'], 'new_price': cart_item['ordered_quantity'] * parseFloat(cart_item_container.attr('data-price'))},
                };
                if (cart_item['ordered_quantity'] <= 0) cart_item_updates['is_removed'] = true;
                remap_cart_modal_table([cart_item_updates]);
            }
            _recalculate_cart_subtotal(true);
            _process_num_cart_items();
        },
    });
}

function _quick_ui_styling(){
    // styling minor elements
    $('.input-err-msg').css('color', 'transparent');
    // rotate each next nav arrow icon 180º i.e make it point to the right
    $('div[name=card-menu-swiper]').each(function() {$(this).children().eq(1).children().eq(0).css('transform', 'rotate(180deg)');});
    // adjust each menu item's title/name a bold font weight
    $('.menu-item-desc').each(() => $(this).children().eq(0).css('font-weight', 'bold'));
}

function _ready_page_for_contents(ready=true){
    if (ready){
        $('.body-content-section').show();
        return $('span[name=page-loading-spinner]').hide();
    }
    $('.body-content-section').hide();
}
function _recalculate_cart_subtotal(perma=false){
    let _subtotal = 0;
    const _subtotal_text_msg = $('section[name=cart-menu-modal-container]').find('[name=selected-item-txt]');
    $('div[name=cart-item-info-container]').each(function(){
        const _item_price = parseFloat($(this).attr('data-price'));
        const _min_quantity = parseInt($(this).attr('data-minquantity'));
        let _selected_quantity = extract_integers($(this).find('[name=item-quantity-input]').val());
        if (_selected_quantity == null) return $(this).find('[name=single-item-total-price-msg]').text('Removed');

        if (_selected_quantity >= _min_quantity){
            _subtotal += _item_price * _selected_quantity;
            $(this).find('[name=single-item-total-price-msg]').text(`$${parseFloat(_item_price * _selected_quantity).toFixed(2)}`);
        }else{
            $(this).find('[name=single-item-total-price-msg]').text(`Must be at least ${_min_quantity}`);
        }
    });
    console.log(_subtotal);
    const _msg = _subtotal > 0 ? `Subtotal: $${parseFloat(_subtotal).toFixed(2)}` : "You don't have any item in your cart right now";
    _subtotal_text_msg.text(_msg);
    _subtotal_text_msg.parent().children().eq(1).text(_subtotal);

    if (perma) _subtotal_text_msg.attr('data-cartsumprice', _subtotal);
}

function _construct_cart_popup_modal(cart_json_data){
    const cart_popup_modal = $('section[name=cart-menu-modal-container]');
    const _selected_item_txt = cart_popup_modal.find('[name=selected-item-txt]');
    _selected_item_txt.css('opacity', '0');
    $('span[name=cart-menu-loading-spinner]').css('display', 'none');
    cart_json_data.forEach(function(cart_item){
        _append_cart_item(cart_item);
    });

    _recalculate_cart_subtotal(true);    
    _selected_item_txt.css('opacity', '1');
}

function _init_modal_resources(modal){
    modal.find('.search-text-field').val(null);
    //modal.find('.table-row').remove();
    //modal.find('th').remove();
    modal.find('[name=selected-item-txt]').css('opacity', `${selected_site_location == null ? '0' : '1'}`);
    //modal.find('.loading-spinner').show();
}

function _describe_selected_modal_item(modal_body, selected_item){
    modal_body.find('.selected-item-txt').empty();
    modal_body.find('.selected-item-txt').append(`Selected: ${selected_item}`);
    modal_body.find('.selected-item-txt').css('opacity', `${selected_item == null ? '0' : '1'}`);
}

function _make_modal_table_header(header_titles, modal_body){
    header_titles.forEach((data) => {
        modal_body.find('.table-header').append(`<th scope='col'>${data}</th>`);
    });
}

function _ready_modal_table_content(modal_body, selected_item_name){
    modal_body.find('.loading-spinner').hide();
    _describe_selected_modal_item(modal_body, selected_item_name);
    modal_body.find('[name=save-modal-change-btn]').attr('disabled', selected_item_name == null);
}

function _render_site_location_modal(response){
    const _site_location_requests = format_json_data(response, {prg_sitelocationrequested: 'site_id',
                                                                        prg_sitelocationrequestid: 'sr_id',
                                                                        prg_sitelocationdescription: 'site_name',
                                                                        prg_contact: 'contact',
                                                                        createdon: 'create_date',
                                                            });
    SITE_LOCATIONS = _site_location_requests.filter((data, idx, self) => 
                                idx == self.findIndex((t) => (
                                    t['site_id'] == data['site_id'] && t['site_name'] == data['site_name']
                                )));

    _ready_modal_table_content($('section[name=site-location-modal-container]'), selected_site_location_name);
    _make_modal_table_header(['', 'Site Location Descriptions', 'Site Location Requested'], $('table[name=site-location-table]'));
    SITE_LOCATIONS.forEach(function(data){
        $('table[name=site-location-table]').append(`<tr class="table-row">
                                                        <td>
                                                            <input ${selected_site_location != null && selected_site_location == String(data['sr_id']) ? 'checked' : ''}
                                                                data-uid='${data['sr_id']}' data-name='${data['site_name']}'
                                                                class='form-check-input checkbox modal-td-radio-chkbox' type='radio' name='site-location-chkbox'/>  
                                                        </td>                           <!--0-->
                                                        <td class='to-be-searched-data'>${data['site_name']}</td>   <!--1-->
                                                        <td class='to-be-searched-data'>${data['site_id']}</td>     <!--2-->
                                                        <td hidden>${data['sr_id']}</td>       <!--3: always for id-->
                                                    </tr>`);
    });
}


function _render_body_content(){
    $.ajax({
        type: 'POST',
        url: 'https://prod-07.australiasoutheast.logic.azure.com:443/workflows/d0f433e67e744bf48c2793e07b681daa/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3ZXhCEjjZBJkm6AzLQv6AMKeKOsuinDy8hsJGphAcTY',
        contentType: 'application/json',
        accept: 'application/json;odata=verbose',
        data: JSON.stringify({
            'tenant_id': USER_ID,
        }),
        success: function(response, status, xhr){
            let _menu_items = [];
            let _menu_types = [];
            let _menu_section_filter_options = [];
            if(!['success'].includes(String(status))) return;
            console.log(response);
            response['catering_cart_items'].forEach(function(cart_item){
                MY_CART.push({
                    'cart_id': String(cart_item.cart_instance.crcfc_appusercateringcartid),
                    'id': String(cart_item.cart_instance._crcfc_cart_item_value),
                    'name': cart_item.catering_item.prg_cateringitemdescription,
                    'price': parseFloat(cart_item.catering_item.prg_priceperunit),
                    'menu_type_id': cart_item.catering_item['_prg_cateringmenu_value'],
                    'menu_type': cart_item.catering_item.prg_menutype,
                    'menu_section':cart_item.catering_item.prg_menusection,
                    'ordered_quantity': parseInt(cart_item.cart_instance.crcfc_quantity),
                    'total_price': parseFloat(parseInt(cart_item.cart_instance.crcfc_quantity) * parseFloat(cart_item.catering_item.prg_priceperunit)),
                    'last_modified': new Date(cart_item.cart_instance.crcfc_last_updated),
                    'img_url': cart_item.catering_item.crcfc_img_url ?? PLACEHOLDER_IMG_URL,
                    'unit': cart_item.catering_item.prg_unit,
                    'min_quantity': cart_item.catering_item.prg_minimumorderquantity <= 0 || cart_item.catering_item.prg_minimumorderquantity == null ? 1 : cart_item.catering_item.prg_minimumorderquantity,
                });
            });
            if (!response['is_function']){
                $('#function-menu-pref-time-input').parent().parent().remove();
                valid_dt['valid_function_datetime'] = true;
            }else{
                _render_datetime_input_field('function-menu-pref-time-input', 'function-menu-time-input-clear', 'valid_function_datetime', 1);
            }
            
            if (!response['is_consumable']){
                $('#consumable-menu-pref-time-input').parent().parent().remove();
                valid_dt['valid_consumable_datetime'] = true;
            }else{
                _render_datetime_input_field('consumable-menu-pref-time-input', 'consumable-menu-time-input-clear', 'valid_consumable_datetime', 1);
            }

            if (!response['is_priority']){
                $('#priority-menu-pref-time-input').parent().parent().remove();
                valid_dt['valid_priority_datetime'] = true;
            }else{
                _render_datetime_input_field('priority-menu-pref-time-input', 'priority-menu-time-input-clear', 'valid_priority_datetime', 2);
            }

            if (!response['is_weekly']){
                $('#weekly-menu-pref-time-input').parent().parent().remove();
                valid_dt['valid_weekly_datetime'] = true;
            }else{
                _render_datetime_input_field('weekly-menu-pref-time-input', 'weekly-menu-time-input-clear', 'valid_weekly_datetime');
            }

            //$('input[name=catering-title-request-input]').val(`-SR-${format_datetime_now_standard()}: ${response['catering_cart_items'].length} item${response['catering_cart_items'].length > 1 ? 's' : ''} from ${response['user_contact_info']['yomifullname']}`);
            $('input[name=catering-title-request-input]').val(`-SR-${format_datetime_now_standard()} from ${response['user_contact_info']['yomifullname']}`);
            _render_site_location_modal(response['site_locations']);
            
            auto_fill_personal_data_fields(response['user_contact_info'])
            _construct_cart_popup_modal(MY_CART);
            _quick_ui_styling();
            //_process_num_cart_items();
            _ready_page_for_contents();
        }
    });
}

function auto_fill_personal_data_fields(user_data_dict){
    function _is_key_value_valid(data, key_name){
        return data.hasOwnProperty(`${key_name}`) && data[`${key_name}`] != null && !is_whitespace(data[`${key_name}`]) && typeof data[`${key_name}`] != 'undefined' && data[`${key_name}`] != undefined;
    }

    if (_is_key_value_valid(user_data_dict, 'emailaddress1') && validate_email(user_data_dict['emailaddress1'])){
        valid_email = true;
        $('input[name=email-input]').val(user_data_dict['emailaddress1']);
    }
    if (_is_key_value_valid(user_data_dict, 'yomifullname')){
        valid_name = true;
        $('input[name=full-name-input]').val(user_data_dict['yomifullname']);
    }
    if (_is_key_value_valid(user_data_dict, 'telephone1') && valid_phonenum(user_data_dict['telephone1'])){
        valid_phonenum = true;
        $('input[name=phone-num-input]').val(user_data_dict['telephone1']);
    }
}

function process_modal_section_render(modal, show=true){
    modal.css('display', `${show ? 'flex' : 'none'}`);
    modal.css('opacity', `${show ? '1' : '0'}`);
    $('body').css('overflow', `${show ? 'hidden' : 'auto'}`);
}


function enable_submit_button(){
    $('button[name=submit-form-btn]').attr('disabled', selected_site_location == null || !valid_building || $('div[name=cart-menu-table]').find('.cart-item-info-container').length < 1 ||
                                                        valid_request_title || !Object.values(valid_dt).every(Boolean) ||
                                                        !valid_email || !valid_name || !valid_phonenum || !valid_cost_code);
}


$(document).ready(function(){
    _ready_page_for_contents(false);
    _render_body_content();

    // Submit button action
    $('button[name=submit-form-btn]').click(function(event){
        $(this).attr('disabled', true);
        $(this).empty();
        $(this).append(BUTTON_LOADING_SPINNER);
        const _this_btn_dom = $(this);

        let cart_values = [];
        $('div[name=cart-item-info-container]').each(function(idx, cart_item){
            console.log($(this));
            let _curr_quantity = $(this).find('[name=item-quantity-input]').val();
            const _min_quantity = parseInt($(this).attr('data-minquantity'));
            if (!$(this).find('[name=item-quantity-input]').val() || !is_valid_digit(_curr_quantity) || extract_integers(_curr_quantity) < _min_quantity){
                _curr_quantity = _min_quantity;
            }else{
                _curr_quantity = parseInt(_curr_quantity);
            }
            
            cart_values.push({
                'tenant_id': USER_ID,
                'cart_id': $(this).attr('data-cartid'),
                'cart_item': $(this).attr('data-cateringitem'),
                'quantity': _curr_quantity,
                'catering_menu': $(this).attr('data-cateringmenu'),
                'menu_name': $(this).attr('data-cateringmenuname'),
                'min_quantity': _min_quantity,
                'menu_type': $(this).attr('data-menusection'),
            });
        });

        const grouped_values = cart_values.reduce((accumulator, curr_item) => {
            const common_menu_type = String(curr_item.catering_menu);
            if (!accumulator[common_menu_type]) {
                let catering_menu_dt = '';
                let catering_menu_name = '--';
                for (const key in menu_type_dt_map){
                    if (menu_type_dt_map[key].includes(common_menu_type)){
                        catering_menu_dt = String($(`#${key}-menu-pref-time-input`).val());
                        catering_menu_name = key;
                        break;
                    }
                }
                accumulator[common_menu_type] = {
                    'catering_menu': common_menu_type,
                    'catering_menu_name': catering_menu_name,
                    'cart_items': [],
                    'pref_dt': catering_menu_dt,
                };
            }
            accumulator[common_menu_type]['cart_items'].push(curr_item);
            return accumulator
        }, {});
        let new_values = [];
        for (const key in grouped_values){
            new_values.push(grouped_values[key]);
        }
        console.log(new_values);
        let _data = {
            'catering_request_title': clean_white_space($('input[name=catering-title-request-input]').val(), false),
            'user_id': USER_ID,
            'user_name': clean_white_space($('input[name=full-name-input]').val(), false),
            'user_mobile': clean_white_space($('input[name=phone-num-input]').val(), false),
            'user_email': clean_white_space($('input[name=email-input]').val(), false),
            'cost_code': $('input[name=cost-code-input]').val(),
            'values': new_values,
            'site_location': selected_site_location,
            'building_room': clean_white_space($('input[name=building-num-input]').val(), false),
        };
        if ($('textarea[name=catering-remark-input]').val()) _data['extra_remarks'] = $('textarea[name=catering-remark-input]').val();
        if ($('textarea[name=catering-instruction-input]').val()) _data['delivery_instruction'] = $('textarea[name=catering-instruction-input]').val();
        if ($('textarea[name=catering-dietary-input]').val()) _data['dietary'] = $('textarea[name=catering-dietary-input]').val();
        console.log(_data);
        console.log(JSON.stringify(_data));
        $.ajax({
            type: 'POST',
            url: 'https://prod-23.australiasoutheast.logic.azure.com:443/workflows/3f38c13eb3174e20966bc3a9cc1ac993/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xUyKMez9XVqmg046xtFXBH7mzIhlseG5Ttiptc3OVZQ',
            contentType: 'application/json',
            accept: 'application/json;odata=verbose',
            data: JSON.stringify(_data),
            complete: function(response){
                _this_btn_dom.empty();
                _this_btn_dom.append('Submit');
                if ([200].includes(response.status)){
                    alert(`New catering request ${$('input[name=catering-title-request-input]').val()} has been made`);
                    //return window.location = `${window.location.origin}/request-submitted/`;
                }else{
                    alert('Failed to submit a catering request at this time');
                }
                location.reload();
            }
        })
    });

    $(document).on('keyup', 'input[name=item-quantity-input]', function (e) {
        //!DIGIT_REGEX.test($(this).val()) ? $(this).val(null) : null;
        !DIGIT_REGEX.test($(this).val()) ? $(this).val(extract_integers($(this).val())) : null;

        const _valid_digit = is_valid_digit($(this).val());
        if (!$(this).val() || parseInt($(this).val()) < parseInt($(this).attr('data-minquantity'))) $(this).val($(this).attr('data-minquantity'));
        if ($(this).attr('data-fromcart') == '1') return _recalculate_cart_subtotal();
        //console.log(_valid_digit);
        const _parent_div = $(this).parent().parent();
        if ($(this).attr('data-fromcart') == '1') return change_cart_item_price($(this), _valid_digit, parseInt($(this).attr('data-minquantity')));

        if ($(this).val() && _valid_digit){
            _parent_div.children().eq(1).css('color', `${parseInt($(this).val()) >= parseInt($(this).attr('data-minquantity')) ? 'transparent' : 'red'}`);
        }else{
            _parent_div.children().eq(1).css('color', `${_valid_digit || !$(this).val() ? 'transparent' : 'red'}`);
        }
        disable_individual_btn(_parent_div.parent().parent().children().eq(4), !$(this).val() || _valid_digit && parseInt($(this).val()) >= parseInt($(this).attr('data-minquantity')));
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
        const _min_quantity = parseInt(_input_field.attr('data-minquantity'));
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
        }

        if (!_input_field.val() || _curr_quantity < _min_quantity){
            _curr_quantity = _min_quantity;
            _input_field.val(_min_quantity);
        }
        if ($(this).attr('data-fromcart') == '1') return _recalculate_cart_subtotal();
        _valid_digit = is_valid_digit(_input_field.val());

        disable_individual_btn($(this).parent().parent().parent().parent().children().eq(4), !_input_field.val() || _valid_digit && parseInt(_input_field.val()) >= _min_quantity);
    });


    // Search function
    $(document).on('keyup', '.search-text-field', function(){
        let _parent_div_class = '.cart-item-section';
        let _filtered_item = '[name=cart-item-info-container]';
        if ($(this).attr('id') == 'site-location-search-textfield'){
            _parent_div_class = '.modal-body';
            _filtered_item = 'tr';
        }
        const searched_value = $(this).val().toLowerCase().trim();
        $(this).closest(_parent_div_class).find(_filtered_item).each(function (index) {
            //if (!index) return;

            $(this).find('.to-be-searched-data').each(function (idx) {
                const value_found_here = $(this).text().toLowerCase().trim();
                const _is_matched = value_found_here.includes(searched_value);
                _is_matched ? $(this).closest(_filtered_item).show() : $(this).closest(_filtered_item).hide();
                return !_is_matched;
            });
        });
    });


    // Modal scripts
    $(MODAL_ACTIVATE_ELEMS).find('.click-to-open-modal').each(function(idx){
        let _modal_dialog = $('section[name=site-location-modal-container]');
        const content_name_attr = $(this).closest('.input-field-container').attr('name');
        if (content_name_attr == 'cleaning-type-content'){
            _modal_dialog = $('section[name=cleaning-type-modal-container]');
        }else if (content_name_attr == 'service-frequency-content'){
            _modal_dialog = $('section[name=cleaning-freq-modal-container]');
        }
        $(this).on('click keyup change' , function(event){
            //console.log(content_name_attr);
            _init_modal_resources(_modal_dialog);
            if (content_name_attr == 'site-location-content'){
                _modal_dialog.find('[name=save-modal-change-btn]').attr('disabled', $('input[name=site-location-chkbox]:checked').length < 1);
            }
            process_modal_section_render(_modal_dialog);
            //_modal_dialog.modal('show');
        });
        
        if ($(this).prop('tagName') == 'INPUT'){
            $(this).keyup(function(event){
                if (content_name_attr == 'site-location-content'){
                    $(this).val(selected_site_location_name);
                }else if (content_name_attr == 'cleaning-type-content'){
                    $(this).val(selected_cleaning_type_name);
                }
            });
        }
    });

    $(MODAL_ACTIVATE_ELEMS).find('[name=clear-input-btn]').each(function(idx){
        const content_name_attr = $(this).closest('.input-field-container').attr('name');
        $(this).click(function(event){
            if (content_name_attr == 'site-location-content'){
                selected_site_location = null;
                selected_site_location_name = null;
                $('input[name=site-location-chkbox]').prop('checked', false);
            }
            $(this).parent().parent().find('.click-to-open-modal-input').val(null);     // clear input text field
            enable_submit_button();
        });
    });

    $('.modal-section').on('click', function(e){
        return e.target == this ? process_modal_section_render($(this), false) : null;
    });

    $('.close-modal-btn, button[name=save-modal-change-btn]').on('click', function(e){
        if ($(this).attr('name') == 'save-modal-change-btn'){
            const select_btn = $(this);
            const _parent_modal = select_btn.parent().parent().parent();
            if (_parent_modal.attr('name') == 'site-location-modal-container'){
                $('span[name=site-location-content]').find('[name=site-location-name-input-field]').val($('input[name=site-location-chkbox]:checked').length > 0 ? $('input[name=site-location-chkbox]:checked').attr('data-name') : null);
            }
        }
        process_modal_section_render($(this).parent().parent().parent(), false);
        enable_submit_button();
    });

    $(document).on('change', '.modal-td-radio-chkbox', function(e){
        if ($(this).prop('checked')){
            const table_row = $(this).parent().parent();
            const _modal_body = $(this).closest('.modal-section');
            if ($(this).attr('name') == 'site-location-chkbox'){
                selected_site_location = $(this).attr('data-uid');
                //selected_site_location = table_row.children().eq(2).text();
                selected_site_location_name = $(this).attr('data-name');
                //_modal_body.find('[name=save-modal-change-btn]').attr('disabled', false);
            }
            _modal_body.find('[name=save-modal-change-btn]').attr('disabled', false);
            _describe_selected_modal_item(_modal_body, $(this).attr('data-name'));      // the 2nd row data always contains the item's name
        }
    });

    $(document).on('keyup', '.input-txt-field', function(e){
        const elem_name_attr = $(this).attr('name');
        const _parent_input_container = $(this).closest('.input-field-container');

        if (elem_name_attr == 'email-input'){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!$(this).val() || validate_email($(this).val()) ? '0' : '1'}`);
            valid_email = $(this).val() != null && validate_email($(this).val());
        }else if(elem_name_attr == 'phone-num-input'){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!$(this).val() || validate_phonenum($(this).val()) ? '0' : '1'}`);
            valid_phonenum = $(this).val() == null || validate_phonenum($(this).val());
        }else if(['full-name-input'].includes(elem_name_attr)){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!$(this).val() || STRING_REGEX.test($(this).val()) ? '0' : '1'}`);
            if (elem_name_attr == 'full-name-input'){
                valid_name = $(this).val() != null && STRING_REGEX.test($(this).val());
            }
        }else if (elem_name_attr == 'square-meterage-input'){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!$(this).val() || REAL_NUM_REGEX.test($(this).val()) ? '0' : '1'}`)
            valid_square_meterage = !$(this).val() || REAL_NUM_REGEX.test($(this).val());
        }else if (['cost-code-input'].includes(elem_name_attr)){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!$(this).val() || REGEX.test($(this).val()) ? '0' : '1'}`);
            if(elem_name_attr == 'cost-code-input') valid_cost_code = $(this).val() != null && REGEX.test($(this).val());
        }else if (['cleaning-request-input', 'building-num-input'].includes(elem_name_attr)){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!is_whitespace($(this).val()) ? '0' : '1'}`);
            if (elem_name_attr == 'building-num-input') valid_building = !is_whitespace($(this).val());
            if (elem_name_attr == 'cleaning-request-input') valid_cleaning_rq = !is_whitespace($(this).val());
        }else if(['catering-title-request-input'].includes(elem_name_attr)){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!is_whitespace($(this).val()) && check_word_limit($(this).val()) ? '0' : '1'}`);
            if(elem_name_attr == 'catering-title-request-input') valid_request_title = !is_whitespace($(this).val()) && check_word_limit($(this).val());
        }
        enable_submit_button();
    });
});