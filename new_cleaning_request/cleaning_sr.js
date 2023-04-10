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
const MODAL_ACTIVATE_ELEMS = 'span[name=site-location-content], span[name=cleaning-type-content]';

let CLEANING_SERVICES = [];
let SITE_LOCATIONS = [];
let CLEANING_FREQUENCIES = [];
let selected_site_location = null;
let selected_site_location_name = null;
let selected_cleaning_type = null;
let selected_cleaning_type_name = null;
let valid_phonenum = true;
let valid_name = false;
let valid_email = false;
let valid_cost_code = false;
let valid_building = false;
let valid_cleaning_rq = false;
let valid_square_meterage = true;
let valid_datetime = true;

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
    console.log(`currdate:${curr_datetime}\nmin_time: ${min_time}\nmax_time: ${max_time}`);

    _datetime_input.attr('min', min_time.toISOString().slice(0, 16));
    _datetime_input.attr('max', max_time.toISOString().slice(0, 16));
    $(document).on('keyup change', 'input[name=datetime-input]', function(e){
        if ($(this).val() == null || !$(this).val()){
            valid_datetime = true;
        }else{
            const entered_datetime = convert_to_datetime($(this).val());
            //console.log(entered_datetime.getHours());
            //console.log(entered_datetime > max_time);
            valid_datetime = !(min_time > entered_datetime || entered_datetime > max_time || entered_datetime.getHours() < EARLIEST || entered_datetime.getHours() + entered_datetime.getMinutes() + entered_datetime.getSeconds() > LATEST);
            $(this).closest('.input-field-container').find('.input-err-msg').css('opacity', `${valid_datetime ? '0' : '1'}`);
            console.log(`valid_datetime: ${!(min_time > entered_datetime || entered_datetime > max_time)}`);
            console.log(`valid_hours: ${!(entered_datetime.getHours() < EARLIEST || entered_datetime.getHours() > LATEST)}`);
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

function _render_cleaning_service_type_modal(){
    $.ajax({
        type: 'POST',
        url: 'https://prod-08.australiasoutheast.logic.azure.com:443/workflows/9deb53bee164477dadb79acc0c1ac773/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=cGjRTTQBl9KyYSR_BoPQSgmSbspv5Z0-LnBwSCzHuEw',
        contentType: 'application/json',
        async: false,
        accept: 'application/json;odata=verbose',
        success: function (response, status, xhr){
            const _cleaning_type_rq = format_json_data(response, {prg_cleaningservicetypeid: 'service_id',
                                                                    prg_cleaningservicetype: 'service_name',
                                                                    organizationid: 'org_id',
                                                                    createdon: 'create_date',
                                                        });
            //
            CLEANING_SERVICES = _cleaning_type_rq.filter((data, idx, self) => 
                                idx == self.findIndex((t) => (
                                    t['service_id'] == data['service_id'] && t['service_name'] == data['service_name']
                                )));

            _ready_modal_table_content($('section[name=cleaning-type-modal-container]'), selected_cleaning_type_name);
            _make_modal_table_header(['', 'Cleaning Service Type'], $('table[name=cleaning-type-table]'));
            CLEANING_SERVICES.forEach(function(data){
                $('table[name=cleaning-type-table]').append(`<tr class="table-row">
                                                                <td>
                                                                    <input ${selected_cleaning_type != null && selected_cleaning_type == String(data['service_id']) ? 'checked' : ''}
                                                                        class='form-check-input checkbox modal-td-radio-chkbox' type='radio' name='cleaning-type-chkbox'/>  
                                                                </td>                           <!--0-->
                                                                <td class='to-be-searched-data'>${data['service_name']}</td>   <!--1-->
                                                                <td hidden>${data['service_id']}</td>     <!--2-->
                                                                <td hidden>${data['service_id']}</td>       <!--3: always for id-->
                                                            </tr>`);
            });
            //$('section[name=cleaning-type-modal-container]').find('[name=save-modal-change-btn]').attr('disabled', selected_cleaning_type == null);
        },
    });
}


function _render_site_location_modal(){
    $.ajax({
        type: 'POST',
        url: 'https://prod-24.australiasoutheast.logic.azure.com:443/workflows/4fe8e77df20c40058c155ddc30d3ed8d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XNimid8um8J96WOKahqQfk_qcSVdl5wijdj6nzrw61Q',
        contentType: 'application/json',
        accept: 'application/json;odata=verbose',
        success: function (response, status, xhr){
            const _site_location_requests = format_json_data(response, {prg_sitelocationrequested: 'site_id',
                                                                        prg_sitelocationrequestid: 'sr_id',
                                                                        prg_sitelocationdescription: 'site_name',
                                                                        prg_contact: 'contact',
                                                                        createdon: 'create_date',
                                                            });
            //console.log(_site_location_requests);                                             
            //$('span[name=site-location-loading-spinner]').hide();
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
                                                                        class='form-check-input checkbox modal-td-radio-chkbox' type='radio' name='site-location-chkbox'/>  
                                                                </td>                           <!--0-->
                                                                <td class='to-be-searched-data'>${data['site_name']}</td>   <!--1-->
                                                                <td class='to-be-searched-data'>${data['site_id']}</td>     <!--2-->
                                                                <td hidden>${data['sr_id']}</td>       <!--3: always for id-->
                                                            </tr>`);
            });
            //$('section[name=site-location-modal-container]').find('[name=save-modal-change-btn]').attr('disabled', selected_site_location == null);
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
    /*console.log(`valid selected_site_location ${selected_site_location != null}`);
    console.log(`valid selected_cleaning_type ${selected_cleaning_type != null}`);
    console.log(`valid_building ${valid_building}`);
    console.log(`valid_cleaning_rq ${valid_cleaning_rq}`);
    console.log(`valid_square_meterage ${valid_square_meterage}`);
    console.log(`valid_email ${valid_email}`);
    console.log(`valid_name ${valid_name}`);
    console.log(`valid_phonenum ${valid_phonenum}`);
    console.log(`valid_cost_code ${valid_cost_code}`);*/
    $('button[name=submit-form-btn]').attr('disabled', selected_site_location == null || selected_cleaning_type == null ||
                                                        !valid_building || !valid_cleaning_rq || !valid_square_meterage || !valid_datetime ||
                                                        !valid_email || !valid_name || !valid_phonenum || !valid_cost_code);
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
        let _modal_dialog = $('section[name=site-location-modal-container]');
        const content_name_attr = $(this).closest('.input-field-container').attr('name');
        if (content_name_attr == 'cleaning-type-content'){
            _modal_dialog = $('section[name=cleaning-type-modal-container]');
        }
        $(this).click(function(event){
            //console.log(content_name_attr);
            _init_modal_resources(_modal_dialog);
            if (content_name_attr == 'site-location-content'){
                _modal_dialog.find('[name=save-modal-change-btn]').attr('disabled', $('input[name=site-location-chkbox]:checked').length < 1);
                _render_site_location_modal();
            }else if (content_name_attr == 'cleaning-type-content'){
                _modal_dialog.find('[name=save-modal-change-btn]').attr('disabled', $('input[name=cleaning-type-chkbox]:checked').length < 1);
                _render_cleaning_service_type_modal();
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
            }else if (content_name_attr == 'cleaning-type-content'){
                selected_cleaning_type = null;
                selected_cleaning_type_name = null;
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
                $('span[name=site-location-content]').find('[name=site-location-name-input-field]').val($('input[name=site-location-chkbox]:checked').length > 0 ? $('input[name=site-location-chkbox]:checked').parent().parent().children().eq(1).text() : null);
            }else if (_parent_modal.attr('name') == 'cleaning-type-modal-container'){
                $('span[name=cleaning-type-content]').find('[name=cleaning-type-input-field]').val($('input[name=cleaning-type-chkbox]:checked').length > 0 ? $('input[name=cleaning-type-chkbox]:checked').parent().parent().children().eq(1).text() : null);
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
                selected_site_location = table_row.children().eq(3).text();
                selected_site_location_name = table_row.children().eq(1).text();
                //_modal_body.find('[name=save-modal-change-btn]').attr('disabled', false);
            }else if ($(this).attr('name') == 'cleaning-type-chkbox'){
                selected_cleaning_type = table_row.children().eq(3).text();
                selected_cleaning_type_name = table_row.children().eq(1).text();
                //_modal_body.find('[name=save-modal-change-btn]').attr('disabled', false);
            }
            _modal_body.find('[name=save-modal-change-btn]').attr('disabled', false);
            _describe_selected_modal_item(_modal_body, table_row.children().eq(1).text());      // the 2nd row data always contains the item's name
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
        }else if (['cost-code-input', 'building-num-input'].includes(elem_name_attr)){
            _parent_input_container.find('.input-err-msg').css('opacity', `${!$(this).val() || REGEX.test($(this).val()) ? '0' : '1'}`);
            if(elem_name_attr == 'cost-code-input'){
                valid_cost_code = $(this).val() != null && REGEX.test($(this).val());
            }
            if (elem_name_attr == 'building-num-input'){
                valid_building = $(this).val() != null && REGEX.test($(this).val());
            }
        }else if (elem_name_attr == 'cleaning-request-input'){
            _parent_input_container.find('.input-err-msg').css('opacity', `${$(this).val() ? '0' : '1'}`)
            valid_cleaning_rq = $(this).val();
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
        const _email_data = $('input[name=email-input]').val();
    });
});