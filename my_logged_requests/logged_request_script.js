// retrieve user id
function get_user_id(){
    const elem_user_id = '{{user.id}}';
    return elem_user_id.includes('{{') && elem_user_id.includes('}}') ? 'bb7c040e-85da-ed11-a7c7-000d3acb5309' : elem_user_id;
}
const sort_opt_dom_ids = '#sort-by-date-asc, #sort-by-date-desc, #sort-by-name-asc, #sort-by-name-desc, #sort-by-id0-asc, #sort-by-id0-desc, #sort-by-id1-asc, #sort-by-id1-desc';
const USER_ID = get_user_id(); 
const REGEX = new RegExp("^[a-zA-Z0-9]+$");
const STRING_REGEX = /^[a-zA-Z\s]+$/;
const NUMBER_REGEX = new RegExp("^[0-9.]+$");
const DIGIT_REGEX = new RegExp("^[0-9]+$");
const REAL_NUM_REGEX = /^[+-]?\d*\.?\d+$/;
const EMAIL_REGEX = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;




function hide_body_on_load(complete=true){
    if(!complete) return $('section').hide();
    $('section').show();
    $('.modal-section').css('display', 'none');
    $('span[name=page-loading-spinner]').hide();
}

function _render_request_table_content(table_name, data_list, data_name, table_headers, title, tr_2nd_class, sort_by_id_opts){
    const parent_section = table_name.closest('section');
    console.log(parent_section);
    parent_section.find('.table-title').append(title);
    parent_section.find('.search-text-field').attr('placeholder', `Search for ${String(title).toLowerCase()}`);

    table_headers.forEach((header, idx) => {table_name.find('.table-header').append(`<th scope='col'><div>${header}</div></th>`);});
    data_list.forEach(function(data){
        let _tr_markup = data['table_assets']['initial_tr_markup'];
        data['table_assets']['td_datas'].forEach(function(item, idx){
            _tr_markup += `<td><div class='row-data-container'>${item}</div></td> <!--${idx}-->`;
        });
        _tr_markup += '</tr>';
        table_name.append(_tr_markup);

        if (data.hasOwnProperty('info_btn_dom')){
            $(data['info_btn_dom']).click(function(e){
                process_modal_section_render($('.modal-section'), true);
                $('.modal-body').append(data['popup_modal_markup']);
            });
        }
    });

    parent_section.find('[name=sort-by-name-asc-label]').append(`${title} (A-Z)`);
    parent_section.find('[name=sort-by-name-desc-label]').append(`${title} (Z-A)`);
    sort_by_id_opts.forEach((opt, idx) => {
        parent_section.find('[name=sort-option-dropdown-menu]').append(`<div class='dropdown-item'>
        <input class='form-check-input product-sort-and-filter-opt' type='radio' name='sort-option-radio-checkbox' id='sort-by-id${idx}-asc'>
        <label class='form-check-label'>${opt} (Ascending)</label>
      </div>
      <div class='dropdown-item'>
        <input class='form-check-input product-sort-and-filter-opt' type='radio' name='sort-option-radio-checkbox' id='sort-by-id${idx}-desc'>
        <label class='form-check-label'>${opt} (Descending)</label>
      </div>`);
    })
    parent_section.find(sort_opt_dom_ids).on('keyup change', function(event){
        if (!$(this).prop('checked')) return;
        const _this_id = $(this).attr('id');
        if (_this_id == 'sort-by-date-desc'){
           $(`${tr_2nd_class}`).sort(function(a, b){
                return new Date($(b).attr('data-createdon')) - new Date($(a).attr('data-createdon'));
            }).appendTo(`table[name=${table_name.attr('name')}]`);
        }else if(_this_id == 'sort-by-date-asc'){
            $(`${tr_2nd_class}`).sort(function(a, b){
                return new Date($(a).attr('data-createdon')) - new Date($(b).attr('data-createdon'));
            }).appendTo(`[name=${table_name.attr('name')}]`);
        }else if (_this_id == 'sort-by-name-asc'){
            $(`${tr_2nd_class}`).sort(function(a, b){
                return $(a).attr('data-namesort').localeCompare($(b).attr('data-namesort'));
            }).appendTo(`[name=${table_name.attr('name')}]`);
        }else if (_this_id == 'sort-by-name-desc'){
            $(`${tr_2nd_class}`).sort(function(a, b){
                return $(b).attr('data-namesort').localeCompare($(a).attr('data-namesort'));
            }).appendTo(`[name=${table_name.attr('name')}]`);
        }else if(_this_id == 'sort-by-id0-asc'){
            $(`${tr_2nd_class}`).sort(function(a, b){
                return $(a).attr('data-sortid0').localeCompare($(b).attr('data-sortid0'));
            }).appendTo(`[name=${table_name.attr('name')}]`);
        }else if(_this_id == 'sort-by-id0-desc'){
            $(`${tr_2nd_class}`).sort(function(a, b){
                return $(b).attr('data-sortid0').localeCompare($(a).attr('data-sortid0'));
            }).appendTo(`[name=${table_name.attr('name')}]`);
        }else if(_this_id == 'sort-by-id1-asc'){
            $(`${tr_2nd_class}`).sort(function(a, b){
                return $(a).attr('data-sortid1').localeCompare($(b).attr('data-sortid1'));
            }).appendTo(`[name=${table_name.attr('name')}]`);
        }else if(_this_id == 'sort-by-id1-desc'){
            $(`${tr_2nd_class}`).sort(function(a, b){
                return $(b).attr('data-sortid1').localeCompare($(a).attr('data-sortid1'));
            }).appendTo(`[name=${table_name.attr('name')}]`);
        }  
    });
}

function _make_table_row_data_assets(item, data_arr, search_data, initial_tr){
    let _tds = {'search_data': '', 'td_datas': [], 'initial_tr_markup': initial_tr};
    _tds['search_data'] = String(search_data);
    _tds['td_datas'] = data_arr;
    /*data_arr.forEach(function(data, idx){
        let _td_key = `td${idx + 1}`;
        _tds['td_datas'].push(data);
    });*/
    item['table_assets'] = _tds;
}

function process_modal_section_render(modal, show=true){
    modal.css('display', `${show ? 'flex' : 'none'}`);
    modal.css('opacity', `${show ? '1' : '0'}`);
    $('body').css('overflow', `${show ? 'hidden' : 'auto'}`);
    modal.find('.modal-body').empty();
    //$('body').css('height', `${show ? '100vh' : 'auto'}`);
    
}

function _render_body_content(){
    $.ajax({
        type: 'POST',
        url: 'https://prod-14.australiasoutheast.logic.azure.com:443/workflows/cc99393f485849bea647c52a2bda02b5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0GgOlsUqEJPlKwlDec8tfe-ZikA9uQoF2ewixczt-3U',
        contentType: 'application/json',
        accept: 'application/json;odata=verbose',
        data: JSON.stringify({'user_id': USER_ID}),
        success: function (response, status, xhr){
            if(!['success'].includes(String(status))) return;
            //console.log(response);
            let MAXIMO_REQUESTS = [];
            let CLEANING_REQUESTS = [];
            let SERVICE_REQUESTS = [];
            response['maximos'].forEach((item, idx) => {
                let data_object = {
                    'uid': item.prg_pfmtportalviewsr_1id,
                    'srid': item.prg_srid,
                    'contractid': item.prg_contractid,
                    'wostatus': item.prg_wostatus,
                    'woid': item.prg_woid,
                    'category': item.prg_category,
                    'request_desc': item.prg_request,
                    'createdon_dt': item.createdon,
                    'createdon_display': item["createdon@OData.Community.Display.V1.FormattedValue"],
                    'complete_date': 'N/A',                    
                };
                data_object['info_btn_dom'] = `maximo-info-btn-${idx}`;
                _make_table_row_data_assets(data_object, 
                                            [item.prg_srid, item.prg_request, item.prg_woid, item.prg_wostatus, item.prg_category, item["createdon@OData.Community.Display.V1.FormattedValue"], 'N/A'], 
                                            `${item.prg_category} ${item.prg_request}`,
                                            `<tr class="table-row maximo-table-row" 
                                                    data-uid="${item.prg_pfmtportalviewsr_1id}" 
                                                    data-forsearch="${item.prg_category} ${item.prg_request}" 
                                                    data-createdon="${item.createdon}" data-namesort="${item.prg_request}" data-sortid0="${item.prg_srid}" data-sortid1="${item.prg_woid}"
                                                    data-srid="${item.prg_srid}" data-sr="${item.prg_request}" data-woid="${item.prg_woid}" data-wostatus="${item.prg_wostatus}"
                                                    data-category="${item.prg_category}" data-completed="N/A">
                                                <td>
                                                    <span name="${data_object['info_btn_dom']}" class="material-symbols-outlined" id="row-data-info-btn">info</span>
                                                </td>`);
                data_object['info_btn_dom'] = `span[name=${data_object['info_btn_dom']}]`;                                    
                data_object['popup_modal_markup'] = `<h5>${item.prg_request}</h5><hr>
                                                        <h6>
                                                            <span>ID:</span>${item.prg_srid}<br>
                                                            <span>WOID:</span>${item.prg_woid}<br>
                                                            <span>WO Contract:</span>${item.prg_contractid}<br>
                                                            <span>WO Request Detail:</span>${item.prg_request}<br>
                                                            <span>Current Approval Status:</span>${item.prg_wostatus}<br>
                                                            <span>Date Raised:</span>${item["createdon@OData.Community.Display.V1.FormattedValue"]}<br>
                                                            <span>Completed On:</span>${'N/A'}<br>
                                                            <span>Requestor Email:</span>${item.prg_requestoremail ?? 'Not provided'}<br>
                                                            <span>Contact Email:</span>${item.prg_contactemail ?? 'Not provided'}
                                                        </h6>`;                                                                                        
                MAXIMO_REQUESTS.push(data_object);
            });

            response['cleanings'].forEach((item, idx) => {
                let data_object = {
                    'uid': item.prg_cleaningserviceid,
                    'desc': item.prg_name,
                    'createdon_dt': item.createdon,
                    'createdon_display': item["createdon@OData.Community.Display.V1.FormattedValue"],
                    'remarks': item.prg_additionalnotes ?? 'Not provided',
                    'building_room': item.prg_buildingroom,
                    'cleaning_sr_name': item["_prg_cleaningservicetype_value@OData.Community.Display.V1.FormattedValue"],
                    'site_location_code': item["_prg_sitelocation_value@OData.Community.Display.V1.FormattedValue"],
                    'clean_frequency': item["_prg_frequency_value@OData.Community.Display.V1.FormattedValue"],
                };
                data_object['info_btn_dom'] = `cleaning-info-btn-${idx}`;
                _make_table_row_data_assets(data_object, 
                    [item.prg_name, item["_prg_sitelocation_value@OData.Community.Display.V1.FormattedValue"], 
                    item.prg_buildingroom, item["_prg_cleaningservicetype_value@OData.Community.Display.V1.FormattedValue"], 
                    item["_prg_frequency_value@OData.Community.Display.V1.FormattedValue"], item["createdon@OData.Community.Display.V1.FormattedValue"]], 
                    `${item.prg_name} ${item.prg_additionalnotes ?? ''} ${item["_prg_cleaningservicetype_value@OData.Community.Display.V1.FormattedValue"]}`,
                    `<tr class="table-row cleaning-table-row" 
                        data-uid="${item.prg_cleaningserviceid}"     data-namesort="${item.prg_name}"   data-sortid0="${item["_prg_sitelocation_value@OData.Community.Display.V1.FormattedValue"]}" data-sortid1="${item.prg_buildingroom}"
                        data-forsearch="${item.prg_name} ${item.prg_additionalnotes ?? ''} ${item["_prg_cleaningservicetype_value@OData.Community.Display.V1.FormattedValue"]}" 
                        data-createdon="${item.createdon}"
                        data-sr="${item.prg_name}" data-sitelocation="${item["_prg_sitelocation_value@OData.Community.Display.V1.FormattedValue"]}" 
                        data-buildingroom="${item.prg_buildingroom}" data-cleaningstype="${item["_prg_cleaningservicetype_value@OData.Community.Display.V1.FormattedValue"]}"
                        data-frequency="${item["_prg_frequency_value@OData.Community.Display.V1.FormattedValue"]}">
                    <td><span name="${data_object['info_btn_dom']}" class="material-symbols-outlined" id="row-data-info-btn">info</span></td>`);

                data_object['info_btn_dom'] = `span[name=${data_object['info_btn_dom']}]`;                                    
                data_object['popup_modal_markup'] = `<h5>${item.prg_name}</h5><hr>
                                                        <h6>
                                                            <span>Site Location:</span>${item["_prg_sitelocation_value@OData.Community.Display.V1.FormattedValue"]}<br>
                                                            <span>Building/Room:</span>${item.prg_buildingroom}<br>
                                                            <span>Cleaning Service:</span>${item["_prg_cleaningservicetype_value@OData.Community.Display.V1.FormattedValue"]}<br>
                                                            <span>Frequency:</span>${item["_prg_frequency_value@OData.Community.Display.V1.FormattedValue"]}<br>
                                                            <span>Remarks:</span>${item.prg_additionalnotes ?? 'Not provided'}<br>
                                                            <span>Date Raised:</span>${item["createdon@OData.Community.Display.V1.FormattedValue"]}<br>
                                                            <span>Requestor Name:</span>${item.prg_contactname}<br>
                                                            <span>Requestor Email:</span>${item.prg_email ?? 'Not provided'}<br>
                                                            <span>Requestor Mobile:</span>${item.prg_contactmobile ?? 'Not provided'}<br>
                                                        </h6>`;
                CLEANING_REQUESTS.push(data_object);
            });
            response['services'].forEach((item, idx) => {
                let data_object = {
                    'uid': item.prg_servicerequestid,
                    'title': item.prg_name,
                    'desc': item.prg_description,
                    'trade_grp_name': item["_prg_tradegroup_value@OData.Community.Display.V1.FormattedValue"],
                    'createdon_dt': item.createdon,
                    'createdon_display': item["createdon@OData.Community.Display.V1.FormattedValue"],
                    'property_info': item["_prg_propertyinformation_value@OData.Community.Display.V1.FormattedValue"],
                    'location_on_property': item.prg_locationonproperty,
                    'health_safety_risk': item.prg_healthsafetyrisk,
                    'risk_desc': item.prg_riskdescription ?? 'Not provided',
                };
                data_object['info_btn_dom'] = `service-rq-info-btn-${idx}`;
                _make_table_row_data_assets(data_object, 
                    [item.prg_name, item["_prg_propertyinformation_value@OData.Community.Display.V1.FormattedValue"], 
                    item.prg_locationonproperty, item.prg_description, item["_prg_tradegroup_value@OData.Community.Display.V1.FormattedValue"],
                    item["createdon@OData.Community.Display.V1.FormattedValue"]], 
                    `${item.prg_name} ${item.prg_description ?? ''} ${item.prg_locationonproperty}`,
                    `<tr class="table-row service-table-row" 
                        data-uid="${item.prg_servicerequestid}"     data-namesort="${item.prg_name}"    data-sortid0="${item["_prg_propertyinformation_value@OData.Community.Display.V1.FormattedValue"]}" data-sortid1="${item["_prg_tradegroup_value@OData.Community.Display.V1.FormattedValue"]}"
                        data-forsearch="${item.prg_name} ${item.prg_description ?? ''} ${item.prg_locationonproperty}" 
                        data-createdon="${item.createdon}"
                        data-sr="${item.prg_name}" data-proprtyinfo="${item["_prg_propertyinformation_value@OData.Community.Display.V1.FormattedValue"]}" 
                        data-locationonprop="${item.prg_locationonproperty}" data-desc="${item.prg_riskdescription ?? 'Not provided'}"
                        data-tradegrp="${item["_prg_tradegroup_value@OData.Community.Display.V1.FormattedValue"]}">
                    <td><span name="${data_object['info_btn_dom']}" class="material-symbols-outlined" id="row-data-info-btn">info</span></td>`);
                 
                data_object['info_btn_dom'] = `span[name=${data_object['info_btn_dom']}]`;                                    
                data_object['popup_modal_markup'] = `<h5>${item.prg_name}</h5><hr>
                                                        <h6>
                                                            <span>Trade Group:</span>${item["_prg_tradegroup_value@OData.Community.Display.V1.FormattedValue"]}<br>
                                                            <span>Trade Service:</span>${item["_prg_tradegroup_value@OData.Community.Display.V1.FormattedValue"]}<br>
                                                            <span>Property Code:</span>${item["_prg_propertyinformation_value@OData.Community.Display.V1.FormattedValue"]}<br>
                                                            <span>Location on Property:</span>${item.prg_locationonproperty}<br>
                                                            
                                                            <span>Health and safety risk:</span>${item.prg_healthsafetyrisk ? 'Yes' : 'No'}<br>
                                                            <span>Risk Description:</span>${item.prg_riskdescription ?? 'N/A'}<br>
                                                            <span>Date Raised:</span>${item["createdon@OData.Community.Display.V1.FormattedValue"]}<br>
                                                            <span>Requestor Name:</span>${item.prg_contactname}<br>
                                                            <span>Requestor Email:</span>${item.prg_contactemail ?? 'Not provided'}<br>
                                                            <span>Requestor Mobile:</span>${item.prg_contactmobile ?? 'Not provided'}<br>
                                                        </h6>`;    
                SERVICE_REQUESTS.push(data_object);
            });
            console.log(CLEANING_REQUESTS);
            console.log(SERVICE_REQUESTS);
            console.log(MAXIMO_REQUESTS);

            // params: table_name, data_list, data_name, table_headers, title, tr_2nd_class
            _render_request_table_content($('table[name=maximo-rq-info-table]'), 
                                            MAXIMO_REQUESTS, 'maximo-request', 
                                            ['', 'SR ID', 'Request', 'WO ID', 'WO Status', 'Category', 'Date Raised', 'Date Completed'], 'Maximo Requests', '.maximo-table-row', ['SR ID', 'WO ID']);
            _render_request_table_content($('table[name=service-rq-info-table]'), SERVICE_REQUESTS, 'service-request', ['', 'Service Request', 'Property Info', 'Location on property', 'Description', 'Trade Group', 'Created On'], 'Service Requests', '.service-table-row', ['Property Info', 'Trade group']);
            _render_request_table_content($('table[name=cleaning-rq-info-table]'), CLEANING_REQUESTS, 'cleaning-request', ['', 'Cleaning Request', 'Site Location', 'Building Room', 'Cleaning Service Type', 'Frequency', 'Created On'], 'Cleaning Requests', '.cleaning-table-row', ['Site Location', 'Building Room']);

            hide_body_on_load();
        },
    });
}


$(document).ready(function(){
    hide_body_on_load(false);
    _render_body_content();
    //hide_body_on_load();

    $('.modal-section').on('click', function(e){
        if ( e.target == this) return process_modal_section_render($(this), false);;
    });

    $('.close-modal-btn').on('click', function(e){
        process_modal_section_render($(this).parent().parent().parent(), false);
    });

    $(document).on('keyup', '.search-text-field', function(){
        const searched_value = $(this).val().toLowerCase().trim();
        $(this).closest('.body-content-section').find('.table-row').each(function (index) {
            const value_found_here = $(this).attr('data-forsearch').toLowerCase().trim();
            console.log(`value_found_here: ${value_found_here}`);
            const _is_matched = value_found_here.includes(searched_value);
            $(this).toggle(_is_matched);
        });
    });
});