/*Util functions*/
// retrieve user id
function get_user_id(){
    const elem_user_id = '{{user.id}}';
    // bb7c040e-85da-ed11-a7c7-000d3acb530      70acd4d5-2e15-4b48-9145-f4caf659eb31
    return elem_user_id.includes('{{') && elem_user_id.includes('}}') ? 'bb7c040e-85da-ed11-a7c7-000d3acb5309' : elem_user_id;
}
const USER_ID = get_user_id(); 

const REGEX = new RegExp("^[a-zA-Z0-9]+$");
const STRING_REGEX = /^[a-zA-Z\s]+$/;
const NUMBER_REGEX = new RegExp("^[0-9.]+$");
const DIGIT_REGEX = new RegExp("^[0-9]+$");
const REAL_NUM_REGEX = /^[+-]?\d*\.?\d+$/;
const EMAIL_REGEX = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

let valid_street_name = false;
let valid_street_num = false;
let valid_suburb = false;

const BUTTON_LOADING_SPINNER = `<div style='width:100%; padding: 0; margin: 0;'>
                                    <div style='display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                max-width: 2.5em;'>
                                        <img src='https://i.ibb.co/Vp2hJGW/loading-spinner.gif' style='max-width:100%;'>
                                    </div>
                                </div>`;

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
/*End of functions*/

function _format_property_json_data(property_json_datas){
    if (typeof property_json_datas == 'undefined') return [];
    let formatted = [];
    property_json_datas.forEach(function(property){
        formatted.push({
            'uid': property['prg_propertyrequestid'],
            'prg_name': property.prg_name,
            'street_num': property['prg_streetnumber'] ?? '_',
            'street_name': property['prg_streetname'] ?? '_',
            'suburb': property['prg_suburb'] ?? '_',
            'street_name_num': property['prg_streetnumberandname'] ?? '_',
            'createdon': new Date(property['createdon']),
            'approval_status': property['prg_processed@OData.Community.Display.V1.FormattedValue'],
            'approval_code': property['prg_processed'],
            'tenant_name': property['_prg_contact_value@OData.Community.Display.V1.FormattedValue'],
        });
    });
    // sort by date of creation
    formatted.sort((a, b) => b['createdon'] - a['createdon']);
    return formatted;
}


function _render_property_table(table_dom, property_list, is_approved=true){
    const _table_headers = !is_approved ? ['Street number', 'Street Name', 'Suburb', 'Approval Status'] : ['Street Number & Name', 'Suburb', 'Approval Status'];
    _table_headers.forEach((table_header) => {
        table_dom.find('.table-header').append(`<th scope='col'>${table_header}</th>`);
    });
    property_list.forEach(function(property){
        table_dom.append(`<tr class="table-row"
                                data-uid="${property['uid']}">  data-prgname="${property['prg_name']}" data-streetnum="${property['street_num']}"
                                data-streetname="${property['street_name']}" data-suburb="${property['suburb']}"  data-streetnamenum="${property['street_name_num']}"
                                data-createdon="${property['createdon']}" data-approvalcode="${property['approval_code']}" data-tenantname="${property['tenant_name']}"
                                data-approvalstatus="${property['approval_status']}">
                                <td${is_approved ? '' : ' hidden'}>${property['street_name_num']}</td>     <!--0-->
                                <td${is_approved ? ' hidden' : ''}>${property['street_num']}</td>     <!--1-->
                                <td${is_approved ? ' hidden' : ''}>${property['street_name']}</td>     <!--2-->
                                <td>${property['suburb']}</td>     <!--3-->
                                <td>${property['approval_status']}</td>     <!--4-->
                                <td hidden>${property['prg_name']}</td>     <!--5-->
                        </tr>`);
    });
}

function _render_body_content(){
    $.ajax({
        type: 'POST',
        url: 'https://prod-16.australiasoutheast.logic.azure.com:443/workflows/8b9266d7777949759a267180796a5270/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fg9XnMIB4EdPzJEErxm-wrDIhbiV5lkKyFN_srC4y0U',
        contentType: 'application/json',
        accept: 'application/json;odata=verbose',
        data: JSON.stringify({'user_id': USER_ID, 'approved_only': false,}),
        success: function(response, status, xhr){
            if(!['success'].includes(String(status))) return;
            const approved_properties = _format_property_json_data(response['approveds']);
            const awaiting_properties = _format_property_json_data(response['awaitings']);
            console.log(approved_properties);
            console.log(awaiting_properties);
            _render_property_table($('table[name=awaiting-property-info-table]'), awaiting_properties, false);
            _render_property_table($('table[name=approved-property-info-table]'), approved_properties, true);
            _ready_page_for_contents();
        },
    });
}



function _ready_page_for_contents(){
    //Unhide on successful resources loading
    $('.body-content-section').show();
    // Hide loading spinner on successful resources loading
    $('.loading-spinner').css('display', 'none');
}

function _hide_elements_on_load(){
    // Hidden element before loading resources
    $('.body-content-section').hide();
}

function enable_property_sr_button(){
    $('button[name=submit-form-btn]').attr('disabled', !valid_street_name || !valid_street_num || !valid_suburb);
}



$(document).ready(function(){
    $('html, body').scrollTop(0);
    _hide_elements_on_load();
    _render_body_content();
    //_ready_page_for_contents();

    $(document).on('change keyup', '.input-txt-field', function(event){
        const _name_attr = $(this).attr('name');
        const _err_msg_field = $(this).closest('.input-field-container').find('.input-err-msg');
        if (['street-num-request-input', 'street-name-request-input'].includes(_name_attr)){
            if (_name_attr == 'street-num-request-input') valid_street_num = $(this).val() && !is_whitespace($(this).val());
            if (_name_attr == 'street-name-request-input') valid_street_name = $(this).val() && !is_whitespace($(this).val());
            _err_msg_field.css('opacity', `${!$(this).val() || !is_whitespace($(this).val()) ? '0' : '1'}`);
        }else if(['suburb-request-input'].includes(_name_attr)){
            if (_name_attr == 'suburb-request-input') valid_suburb = $(this).val() && !is_whitespace($(this).val()) && validate_regex($(this).val());
            _err_msg_field.css('opacity', `${!$(this).val() || validate_regex($(this).val()) ? '0' : '1'}`);
        }
        enable_property_sr_button();
    });

    $('button[name=submit-form-btn]').click(function(event){
        const this_btn = $(this);
        this_btn.attr('disabled', true);
        $('.input-field-container').attr('disabled', true);
        this_btn.empty();
        this_btn.append(BUTTON_LOADING_SPINNER);

        const _street_name_data = clean_white_space($('input[name=street-name-request-input]').val());
        const _street_num_data = clean_white_space($('input[name=street-num-request-input]').val());
        const _suburb_data = clean_white_space($('input[name=suburb-request-input]').val());
        $.ajax({
            type: 'POST',
            url: 'https://prod-15.australiasoutheast.logic.azure.com:443/workflows/5ece9881cb354d50a1d2be8e7eb419a1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fBilZIo3IMgiL5oFXXzOeBPK0B3egEURfJ74z2vv_Zs',
            contentType: 'application/json',
            accept: 'application/json;odata=verbose',
            data: JSON.stringify({'user_id': USER_ID, 
                                    'street_name': _street_name_data, 
                                    'street_num': _street_num_data,
                                    'suburb': _suburb_data,
                                    'street_num_name': `${_street_num_data} ${_street_name_data}`}),
        complete: function(response){
            this_btn.attr('disabled', true);
            $('.input-field-container').attr('disabled', true);
            $('.input-field-container').val(null);
            this_btn.empty();
            this_btn.append('Submit');
            if ([200].includes(response.status)){
                alert(`Your property ${_street_num_data} ${_street_name_data} has successfully been registered`);
                //return window.location = `${window.location.origin}/new-property-pending/`;
            }else{
                alert(`Failed to register your property ${_street_num_data} ${_street_name_data} at this time`);
            }
            location.reload();
        },
    });
    });
});