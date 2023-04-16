const REGEX = new RegExp("^[a-zA-Z0-9]+$");
const STRING_REGEX = /^[a-zA-Z\s]+$/;
const NUMBER_REGEX = new RegExp("^[0-9.]+$");
const DIGIT_REGEX = new RegExp("^[0-9]+$");
const REAL_NUM_REGEX = /^[+-]?\d*\.?\d+$/;
const EMAIL_REGEX = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
// Business hours
const EARLIEST = 9;
const LATEST = 17;

let _is_valid_datetime = false;
const _datetime_input = $('input[name=datetime-input]');
const FORM_DOM = $('form[name=cleaning-request-form]');
const INSET_BOX_SHADOW_BOTTOM = 'inset 0px -25px 20px -20px rgba(0, 0, 0, 0.2)';
const INSET_BOX_SHADOW_TOP  = 'inset 0px 25px 20px -20px rgba(0, 0, 0, 0.2)';
const MOBILE_SCREEN_WIDTH = 780;
const MODAL_ACTIVATE_ELEMS = 'span[name=property-info-content], span[name=trade-group-content]';
const BUTTON_LOADING_SPINNER = `<div style='width:100%; padding: 0; margin: 0;'>
                                    <div style='display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                max-width: 2.5em;'>
                                        <img src='https://i.ibb.co/Vp2hJGW/loading-spinner.gif' style='max-width:100%;'>
                                    </div>
                                </div>`;

let PROPERTY_INFO = [];
let TRADE_GROUP = [];
let CLEANING_FREQUENCIES = [];
let selected_property = null;
let selected_property_name = null;
let selected_trade_group = null;
let selected_trade_group_name = null;


let valid_phonenum = false;
let valid_name = false;
let valid_email = true;
let valid_request_title = false;
let valid_request_desc =  false;
let valid_property_location = false;
let has_health_safety_risk = false;


// Util functions
function validate_varchar(varchar) {
    return STRING_REGEX.test(varchar);
}
function validate_email(email) {
    return EMAIL_REGEX.test(email);
}
function validate_regex(input_string){
    return STRING_REGEX.test(input_string);
}
function validate_phonenum(phonenum){
    const phone_num = phonenum.trim();
    if (phonenum == '' || phonenum == null){
        return true;
    }
    if (!DIGIT_REGEX.test(phone_num.trim())){
        return DIGIT_REGEX.test(phone_num.trim());
    }else{
        return !((8 > phone_num.length) || (phone_num.length > 11))
    }
}
function format_json_data(response, key_map){
    return response.value.map(reponse_data => Object.fromEntries(Object.entries(reponse_data).map(([key, value]) => [key_map[key] || key, value])));
}

function convert_to_datetime(dt_str){
    return new Date(String(dt_str));
}
function clean_white_space(input_string, all=true){
    return input_string.replace(/\s+/g, all ? '' : ' ');
}
function is_whitespace(str) {
    return !str.trim().length;
}
// End of util functions

function _render_datetime_input_field(){
    let curr_datetime = new Date();
    let two_months_later = new Date();

    // Earliest is 9am
    let min_time = convert_to_datetime(curr_datetime);
    if (min_time.getHours() > LATEST){
        min_time.setDate(min_time.getDate() + 1);
    }
    min_time.setHours(EARLIEST, 0, 0, 0);

    // Latest time is 9pm
    let max_time = convert_to_datetime(curr_datetime);
    max_time.setMonth(max_time.getMonth() + 2);
    max_time.setHours(LATEST, 0, 0, 0);
    //console.log(`currdate:${curr_datetime}\nmin_time: ${min_time}\nmax_time: ${max_time}`);

    _datetime_input.attr('min', min_time.toISOString().slice(0, 16));
    _datetime_input.attr('max', max_time.toISOString().slice(0, 16));
    $(document).on('keyup change', 'input[name=datetime-input]', function(e){
        if ($(this).val() == null || !$(this).val()){
            valid_datetime = true;
        }else{
            const entered_datetime = convert_to_datetime($(this).val());
            console.log(entered_datetime.getHours());
            console.log(entered_datetime > max_time);
            valid_datetime = !(min_time > entered_datetime || entered_datetime > max_time || entered_datetime.getHours() < EARLIEST || entered_datetime.getHours() + entered_datetime.getMinutes()/60 + entered_datetime.getSeconds()/3600 > LATEST);
            $(this).closest('.input-field-container').find('.input-err-msg').css('opacity', `${valid_datetime ? '0' : '1'}`);
            //console.log(`valid_datetime: ${!(min_time > entered_datetime || entered_datetime > max_time)}`);
            //console.log(`valid_hours: ${!(entered_datetime.getHours() < EARLIEST || entered_datetime.getHours() > LATEST)}`);
        }
        enable_submit_button();
    });

    $(document).on('click', 'span[name=clear-datetime-input-btn]', function(event){
        $('input[name=datetime-input]').val(null);
        valid_datetime = true;
        $(this).closest('.input-field-container').find('.input-err-msg').css('opacity', `${valid_datetime ? '0' : '1'}`);
        enable_submit_button();
    });
}

function _init_modal_resources(modal){
    modal.find('.search-text-field').val(null);
    modal.find('.table-row').remove();
    modal.find('th').remove();
    modal.find('[name=selected-item-txt]').css('opacity', '0');
    modal.find('.loading-spinner').show();
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

function _render_property_info_modal(){
    $.ajax({
        type: 'POST',
        url: 'https://prod-16.australiasoutheast.logic.azure.com:443/workflows/8b9266d7777949759a267180796a5270/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fg9XnMIB4EdPzJEErxm-wrDIhbiV5lkKyFN_srC4y0U',
        contentType: 'application/json',
        async: false,
        accept: 'application/json;odata=verbose',
        success: function (response, status, xhr){
            const _property_rqs = format_json_data(response, {'_prg_propertylist_value@OData.Community.Display.V1.FormattedValue': 'location_code',
                                                                    prg_streetnumberandname: 'street_name',
                                                                    prg_propertyrequestid: 'property_uid',
                                                                    prg_suburb: 'suburb',
                                                                    prg_name: 'property_num',
                                                        });
            PROPERTY_INFO = _property_rqs.filter((data) => (data['street_name'] != null && !is_whitespace(data['street_name'])));

            _ready_modal_table_content($('section[name=property-info-modal-container]'), selected_property_name);
            _make_modal_table_header(['', 'Code', 'Street Number & Name', 'Suburb'], $('table[name=property-info-table]'));
            PROPERTY_INFO.forEach(function(data){
                $('table[name=property-info-table]').append(`<tr class="table-row">
                                                                <td>
                                                                    <input ${selected_property != null && selected_property == String(data['property_uid']) ? 'checked' : ''}
                                                                        data-uid='${data['property_uid']}' data-name='${data['street_name']}'
                                                                        class='form-check-input checkbox modal-td-radio-chkbox' type='radio' name='property-info-chkbox'/>  
                                                                </td>                           <!--0-->
                                                                <td>${data['property_num']}</td>   <!--1-->
                                                                <td class='to-be-searched-data'>${data['street_name']}</td>     <!--2-->
                                                                <td class='to-be-searched-data'>${data['suburb']}</td>       <!--3-->
                                                            </tr>`);
            });
        },
    });
}


function _render_trade_group_modal(){
    $.ajax({
        type: 'POST',
        url: 'https://prod-24.australiasoutheast.logic.azure.com:443/workflows/b827d25a70f04f3eb64cecb348039e8c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ibqLFSrp1I7M7vbOqsIoc3VybQDQG0WRk5R5nPcbSYE',
        contentType: 'application/json',
        accept: 'application/json;odata=verbose',
        success: function (response, status, xhr){
            const _trade_group_rqs = format_json_data(response, {prg_siteid: 'site_id',
                                                                prg_tradegroupcode: 'trade_grp_code',
                                                                prg_name: 'trade_grp_name',
                                                                prg_tradegroupid: 'trade_grp_uid'
                                                            });
            //console.log(_trade_group_rqs);                                             
            //$('span[name=trade-group-loading-spinner]').hide();
            TRADE_GROUP = _trade_group_rqs.filter((data, idx, self) => 
                                idx == self.findIndex((t) => (
                                    t['trade_grp_code'] == data['trade_grp_code'] && t['trade_grp_name'] == data['trade_grp_name']
                                )));

            _ready_modal_table_content($('section[name=trade-group-modal-container]'), selected_trade_group_name);
            _make_modal_table_header(['', 'Code', 'Name', 'Site'], $('table[name=trade-group-table]'));
            TRADE_GROUP.forEach(function(data){
                $('table[name=trade-group-table]').append(`<tr class="table-row">
                                                                <td>
                                                                    <input ${selected_trade_group != null && selected_trade_group == String(data['trade_grp_uid']) ? 'checked' : ''}
                                                                        data-uid='${data['trade_grp_uid']}' data-name='${data['trade_grp_name']}'
                                                                        class='form-check-input checkbox modal-td-radio-chkbox' type='radio' name='trade-group-chkbox'/>  
                                                                </td>                           <!--0-->
                                                                <td class='to-be-searched-data'>${data['trade_grp_code']}</td>   <!--1-->
                                                                <td class='to-be-searched-data'>${data['trade_grp_name']}</td>     <!--2-->
                                                                <td>${data['site_id']}</td>       <!--3-->
                                                            </tr>`);
            });
        },
    });
}

function _render_modal_section(modal){
    modal.css('display', 'flex');
}

function _close_modal_section(modal){
    modal.css('display', 'none');
}

function process_modal_section_render(modal, show=true){
    modal.css('display', `${show ? 'flex' : 'none'}`);
    modal.css('opacity', `${show ? '1' : '0'}`);
    $('body').css('overflow', `${show ? 'hidden' : 'auto'}`);
}

function enable_submit_button(){
    $('button[name=submit-form-btn]').attr('disabled', selected_trade_group == null || selected_property == null ||
                                                        !valid_property_location || !valid_request_title || !valid_request_desc ||
                                                        !valid_email || !valid_name || !valid_phonenum);
}

function form_scrolling_event_listener(){
    if ($(window).width() <= MOBILE_SCREEN_WIDTH) return FORM_DOM.css('box-shadow', 'none');
    if (FORM_DOM.scrollTop() <= 5){
        FORM_DOM.css('box-shadow', INSET_BOX_SHADOW_BOTTOM);
    }
    else if (FORM_DOM.scrollTop() > FORM_DOM.height()*1.05){
        FORM_DOM.css('box-shadow', INSET_BOX_SHADOW_TOP);
    }
}


$(document).ready(function(){
    _render_datetime_input_field();
    $('span[name=loading-spinner]').parent().parent().remove();
    $('.input-form-section').css('opacity', '1');
    FORM_DOM.on('scroll', form_scrolling_event_listener);
    $(window).on('resize', form_scrolling_event_listener);

    $(MODAL_ACTIVATE_ELEMS).find('.click-to-open-modal').each(function(idx){
        let _modal_dialog = $('section[name=trade-group-modal-container]');
        const content_name_attr = $(this).closest('.input-field-container').attr('name');
        if (content_name_attr == 'property-info-content'){
            _modal_dialog = $('section[name=property-info-modal-container]');
        }
        $(this).click(function(event){
            //console.log(content_name_attr);
            _init_modal_resources(_modal_dialog);
            if (content_name_attr == 'trade-group-content'){
                _modal_dialog.find('[name=save-modal-change-btn]').attr('disabled', $('input[name=trade-group-chkbox]:checked').length < 1);
                _render_trade_group_modal();
            }else if (content_name_attr == 'property-info-content'){
                _modal_dialog.find('[name=save-modal-change-btn]').attr('disabled', $('input[name=property-info-chkbox]:checked').length < 1);
                _render_property_info_modal();
            }
            process_modal_section_render(_modal_dialog);
            //_modal_dialog.modal('show');
        });
        
        if ($(this).prop('tagName') == 'INPUT'){
            $(this).keyup(function(event){
                if (content_name_attr == 'trade-group-content'){
                    $(this).val(selected_trade_group_name);
                }else if (content_name_attr == 'property-info-content'){
                    $(this).val(selected_cleaning_type_name);
                }
            });
        }
    });

    $(MODAL_ACTIVATE_ELEMS).find('[name=clear-input-btn]').each(function(idx){
        const content_name_attr = $(this).closest('.input-field-container').attr('name');
        $(this).click(function(event){
            if (content_name_attr == 'trade-group-content'){
                selected_trade_group = null;
                selected_trade_group_name = null;
            }else if (content_name_attr == 'property-info-content'){
                selected_property = null;
                selected_property_name = null;
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
            if (_parent_modal.attr('name') == 'trade-group-modal-container'){
                $('span[name=trade-group-content]').find('[name=trade-group-name-input-field]').val($('input[name=trade-group-chkbox]:checked').length > 0 ? $('input[name=trade-group-chkbox]:checked').attr('data-name') : null);
            }else if (_parent_modal.attr('name') == 'property-info-modal-container'){
                $('span[name=property-info-content]').find('[name=property-info-input-field]').val($('input[name=property-info-chkbox]:checked').length > 0 ? $('input[name=property-info-chkbox]:checked').attr('data-name') : null);
            }
        }
        process_modal_section_render($(this).parent().parent().parent(), false);
        enable_submit_button();
    });

    $(document).on('change', '.modal-td-radio-chkbox', function(e){
        if ($(this).prop('checked')){
            const _modal_body = $(this).closest('.modal-section');
            if ($(this).attr('name') == 'trade-group-chkbox'){
                selected_trade_group = $(this).attr('data-uid');
                selected_trade_group_name = $(this).attr('data-name');
                //_modal_body.find('[name=save-modal-change-btn]').attr('disabled', false);
            }else if ($(this).attr('name') == 'property-info-chkbox'){
                selected_property = $(this).attr('data-uid');
                selected_property_name = $(this).attr('data-name');
                //_modal_body.find('[name=save-modal-change-btn]').attr('disabled', false);
            }
            _modal_body.find('[name=save-modal-change-btn]').attr('disabled', false);
            _describe_selected_modal_item(_modal_body, $(this).attr('data-name'));      // the 2nd row data always contains the item's name
        }
    });

    $('input[name=health-and-safety-checkbox]').on('change', function(event){
        has_health_safety_risk = $(this).prop('checked') && $(this).attr('data-choice') == 'yes';
    });

    $(document).on('keyup', '.input-txt-field', function(e){
        const elem_name_attr = $(this).attr('name');
        const _parent_input_container = $(this).closest('.input-field-container');

        if (elem_name_attr == 'email-input'){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!$(this).val() || validate_email($(this).val()) ? '0' : '1'}`);
            valid_email = !$(this).val() || validate_email($(this).val());
        }else if(elem_name_attr == 'phone-num-input'){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!$(this).val() || validate_phonenum($(this).val()) ? '0' : '1'}`);
            valid_phonenum = validate_phonenum($(this).val());
        }else if(['full-name-input'].includes(elem_name_attr)){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!$(this).val() || STRING_REGEX.test($(this).val()) ? '0' : '1'}`);
            if (elem_name_attr == 'full-name-input') valid_name = $(this).val() != null && STRING_REGEX.test($(this).val());
        }else if (['issue-title-request-input', 'issue-desc-input', 'property-location-input'].includes(elem_name_attr)){
            _parent_input_container.find('.input-err-msg').css('opacity', `${$(this).val() == '' || !is_whitespace($(this).val()) ? '0' : '1'}`);
            if (elem_name_attr == 'issue-desc-input') valid_request_desc = !is_whitespace($(this).val());
            if (elem_name_attr == 'issue-title-request-input') valid_request_title = !is_whitespace($(this).val());
            if (elem_name_attr == 'property-location-input') valid_property_location = !is_whitespace($(this).val());
        }
        enable_submit_button();
    });

    $(document).on('keyup', '.search-text-field', function(){
        const searched_value = $(this).val().toLowerCase().trim();
        $(this).closest('.modal-body').find('tr').each(function (index) {
            if (!index) return;

            $(this).find('.to-be-searched-data').each(function (idx) {
                const value_found_here = $(this).text().toLowerCase().trim();
                const _is_matched = value_found_here.includes(searched_value);
                $(this).closest('tr').toggle(_is_matched);
                return !_is_matched;
            });
        });
    });

    $('button[name=submit-form-btn]').click(function(event){
        const _this_btn_dom = $(this);
        _this_btn_dom.attr('disabled', true);
        _this_btn_dom.empty();
        _this_btn_dom.append(BUTTON_LOADING_SPINNER);
        let data_schema = {
            "phone_num_data": clean_white_space($('input[name=phone-num-input]').val()),
            "email_data": !$('input[name=email-input]').val() || is_whitespace($('input[name=email-input]').val()) ? '' : clean_white_space($('input[name=email-input]').val()),
            "name_data": clean_white_space($('input[name=full-name-input]').val(), false),

            "has_health_safety_risk": has_health_safety_risk,
            "health_safety_risk_desc": !$('textarea[name=risk-desc-input]').val() ? '' : $('textarea[name=risk-desc-input]').val(),
            "trade_group_data": selected_trade_group,
            "property_info_data": selected_property,
            "location_on_property": $('input[name=property-location-input]').val(),
            "issue_title": $('input[name=issue-title-request-input]').val(),
            "issue_desc": $('textarea[name=issue-desc-input]').val(),
        };
        console.log(data_schema);
        $.ajax({
            type: 'POST',
            url: 'https://prod-01.australiasoutheast.logic.azure.com:443/workflows/58791740c609464d8070ed6b5349efb3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tuCr2DJwyRxpSIys2Gc06zrThNHdUiGRPqauxfp3pPs',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data_schema),
            complete: function(response){
                _this_btn_dom.empty();
                _this_btn_dom.append('Submit');
                alert(`New service request ${response.responseText} has been made`);
                location.reload();
            },
            success: function(response){
                alert(`New service request ${response.responseText} has been made`);
                location.reload();
            },
            /*error: function(response){
                alert('Failed to submit a new cleaning request at this time');
            },*/
        });
    });
});