const REGEX = new RegExp("^[a-zA-Z0-9]+$");
const STRING_REGEX = /^[a-zA-Z\s]+$/;
const NUMBER_REGEX = new RegExp("^[0-9.]+$");
const DIGIT_REGEX = new RegExp("^[0-9]+$");
const REAL_NUM_REGEX = /^[+-]?\d*\.?\d+$/;
const EMAIL_REGEX = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

let _is_valid_datetime = false;
const _datetime_input = $('input[name=datetime-input]');
let CLEANING_SERVICES = [];
let SITE_LOCATIONS = [];
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
    phone_num = phonenum.trim();
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
    let two_months_later = new Date(curr_datetime.getTime() + (60 * 60 * 24 * 60 * 1000 * 60));

    // Earliest is 9am
    let min_time = convert_to_datetime(curr_datetime);
    min_time.setHours(9, 0, 0, 0);

    // Latest time is 9pm
    let max_time = convert_to_datetime(curr_datetime);
    max_time.setHours(17, 0, 0, 0);

    _datetime_input.attr('min', min_time.toISOString().slice(0, 16));
    _datetime_input.attr('max', two_months_later.toISOString().slice(0, 16));
    /*_datetime_input.on('input', function(){
        let date_field = $(this).val();
        let time_field = new Date(date_field).getHours();
        if (time_field < 9 || time_field >= 17){
            $(this).val(min_time.toISOString().slice(0, 16));
            console.log('invalid date time value');
        }
    });*/
}

function _init_modal_resources(modal){
    modal.find('.table-row').remove();
    modal.find('th').remove();
    modal.find('[name=selected-item-txt]').empty();
    modal.find('.loading-spinner').show();
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

            $('section[name=cleaning-type-modal-container]').find('.loading-spinner').hide();
            $('section[name=cleaning-type-modal-container]').find('[name=selected-item-txt]').append(selected_cleaning_type_name);

            ['', 'Cleaning Service Type'].forEach((data) => {
                $('table[name=cleaning-type-table]').find('.table-header').append(`<th scope='col'>${data}</th>`);
            });
            CLEANING_SERVICES.forEach(function(data){
                $('table[name=cleaning-type-table]').append(`<tr class="table-row">
                                                                <td>
                                                                    <input ${selected_cleaning_type != null && selected_cleaning_type == String(data['service_id']) ? 'checked' : ''}
                                                                        class='form-check-input checkbox' type='radio' name='cleaning-type-chkbox'/>  
                                                                </td>                           <!--0-->
                                                                <td class='to-be-searched-data'>${data['service_name']}</td>   <!--1-->
                                                                <td hidden>${data['service_id']}</td>     <!--2-->
                                                                <td hidden>${data['service_id']}</td>       <!--3: always for id-->
                                                            </tr>`);
            });
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

            $('section[name=site-location-modal-container]').find('.loading-spinner').hide();
            $('section[name=site-location-modal-container]').find('[name=selected-item-txt]').append(selected_site_location_name);

            ['', 'Site Location Descriptions', 'Site Location Requested'].forEach((data) => {
                $('table[name=site-location-table]').find('.table-header').append(`<th scope='col'>${data}</th>`);
            });
            SITE_LOCATIONS.forEach(function(data){
                $('table[name=site-location-table]').append(`<tr class="table-row">
                                                                <td>
                                                                    <input ${selected_site_location != null && selected_site_location == String(data['sr_id']) ? 'checked' : ''}
                                                                        class='form-check-input checkbox' type='radio' name='site-location-chkbox'/>  
                                                                </td>                           <!--0-->
                                                                <td class='to-be-searched-data'>${data['site_name']}</td>   <!--1-->
                                                                <td class='to-be-searched-data'>${data['site_id']}</td>     <!--2-->
                                                                <td hidden>${data['sr_id']}</td>       <!--3: always for id-->
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
                                                        !valid_building || !valid_cleaning_rq || !valid_square_meterage || 
                                                        !valid_email || !valid_name || !valid_phonenum || !valid_cost_code);
}


$(document).ready(function(){
    _render_datetime_input_field();
    $('span[name=loading-spinner]').parent().parent().remove();
    $('.input-form-section').css('opacity', '1');

    $(document).on('keyup change', 'input[name=datetime-input]', function(e){
        const _selected_datetime_value = convert_to_datetime($(this).val());
        const _min_dt_attr = convert_to_datetime($(this).attr('min'));
        const _max_dt_attr = convert_to_datetime($(this).attr('max'));
        _is_valid_datetime = _min_dt_attr <= _selected_datetime_value <= _max_dt_attr;
        $(this).parent().parent().find('.input-err-msg').css('color', `${_is_valid_datetime ? 'transparent' : 'red'}`);
        console.log(_is_valid_datetime);
        console.log($(this).val());
    });

    $('span[name=site-location-content], span[name=cleaning-type-content]').find('.click-to-open-modal').each(function(idx){
        let _modal_dialog = $('section[name=site-location-modal-container]');
        const content_name_attr = $(this).closest('.input-field-container').attr('name');
        if (content_name_attr == 'cleaning-type-content'){
            _modal_dialog = $('section[name=cleaning-type-modal-container]');
        }
        $(this).click(function(event){
            console.log(content_name_attr);
            _init_modal_resources(_modal_dialog);
            
            if (content_name_attr == 'site-location-content'){
                _modal_dialog.find('[name=save-modal-change-btn]').attr('disabled', $('input[name=site-location-chkbox]:checked').length < 1);
                _render_site_location_modal();
            }else if (content_name_attr == 'cleaning-type-content'){
                _modal_dialog.find('[name=save-modal-change-btn]').attr('disabled', $('input[name=cleaning-type-chkbox]:checked').length < 1);
                _render_cleaning_service_type_modal()
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

    $('span[name=site-location-content], span[name=cleaning-type-content]').find('[name=clear-input-btn]').each(function(idx){
        const content_name_attr = $(this).closest('.input-field-container').attr('name');
        $(this).click(function(event){
            if (content_name_attr == 'site-location-content'){
                selected_site_location = null;
                selected_site_location_name = null;
                $(this).parent().parent().find('[name=site-location-name-input-field]').val(null);
            }else if (content_name_attr == 'cleaning-type-content'){
                selected_cleaning_type = null;
                selected_cleaning_type_name = null;
                $(this).parent().parent().find('[name=cleaning-type-input-field]').val(null);
            }
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

    $(document).on('change', 'input[name=site-location-chkbox], input[name=cleaning-type-chkbox]', function(e){
        if ($(this).prop('checked')){
            const table_row = $(this).parent().parent();
            const _modal_body = $(this).closest('.modal-section');
            if ($(this).attr('name') == 'site-location-chkbox'){
                selected_site_location = String(table_row.children().eq(3).text());
                selected_site_location_name = `Selected ${table_row.children().eq(1).text()}`;
                _modal_body.find('[name=save-modal-change-btn]').attr('disabled', $('input[name=site-location-chkbox]:checked').length < 1);
            }else if ($(this).attr('name') == 'cleaning-type-chkbox'){
                selected_cleaning_type = String(table_row.children().eq(3).text());
                selected_cleaning_type_name = `Selected ${table_row.children().eq(1).text()}`;
                _modal_body.find('[name=save-modal-change-btn]').attr('disabled', $('input[name=cleaning-type-chkbox]:checked').length < 1);
            }
            _modal_body.find('.selected-item-txt').empty();
            _modal_body.find('.selected-item-txt').append(`Selected: ${table_row.children().eq(1).text()}`);
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
        let value = $(this).val().toLowerCase().trim();
        $(this).closest('.modal-body').find('tr').each(function (index) {
            if (!index) return;

            $(this).find('.to-be-searched-data').each(function (idx) {
                var id = $(this).text().toLowerCase().trim();
                var not_found = !(id.includes(value));
                $(this).closest('tr').toggle(!not_found);
                return not_found;
            });
        });
    });
});