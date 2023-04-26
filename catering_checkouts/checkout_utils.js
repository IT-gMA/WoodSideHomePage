const REGEX = new RegExp("^[a-zA-Z0-9]+$");
const STRING_REGEX = /^[a-zA-Z\s]+$/;
const NUMBER_REGEX = new RegExp("^[0-9.]+$");
const DIGIT_REGEX = new RegExp("^[0-9]+$");
const REAL_NUM_REGEX = /^[+-]?\d*\.?\d+$/;
const EMAIL_REGEX = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
// Business hours
const EARLIEST = 9;
const LATEST = 17;

function is_whitespace(str) {
    return !str.trim().length;
}
function is_valid_digit(digit){
    return DIGIT_REGEX.test(digit.trim()) && digit != '' && digit != null;
}
function extract_integers(input_str){
    if (input_str.match(/\d+/g) == null) return null;
    return parseInt(input_str.match(/\d+/g));
}

function extract_doubles(input_str){
    if (input_str.match(/\d+/g) == null) return null;
    return parseInt(input_str.match(/\d+/g));
}

function check_word_limit(input_str, max_word_count=25){
    if ([null, undefined].includes(input_str) || typeof input_str == 'undefined') return true;
    return clean_white_space(input_str, false).split(' ').length <= max_word_count;
}

function _render_datetime_input_field(datetime_input_field_id, clear_dt_input_btn_id, valid_dt_bool, min_day_apart=-1){
    let curr_datetime = new Date();
    let two_months_later = new Date();

    // Earliest is 9am
    let min_time = convert_to_datetime(curr_datetime);
    if (min_day_apart < 0){
        if (min_time.getHours() > LATEST * 0.6) min_time.setDate(min_time.getDate() + 1);
        //min_time.setDate(min_time.getDate() + 1);
    }else{
        min_time.setDate(min_time.getDate() + min_day_apart);
        /*if (min_time.getHours() > LATEST * 0.85) {
            min_time.setDate(min_time.getDate() + min_day_apart + 1);
        }else{
            min_time.setDate(min_time.getDate() + min_day_apart);
        }*/
    }

    // Latest time is 9pm
    let max_time = convert_to_datetime(curr_datetime);
    max_time.setMonth(max_time.getMonth() + 2);
    max_time.setHours(LATEST, 0, 0, 0);
    //console.log(`currdate:${curr_datetime}\nmin_time: ${min_time}\nmax_time: ${max_time}`);

    _datetime_input.attr('min', min_time.toISOString().slice(0, 16));
    _datetime_input.attr('max', max_time.toISOString().slice(0, 16));
    $(document).on('keyup change', `#${datetime_input_field_id}`, function(e){
        if ($(this).val() == null || !$(this).val()){
            valid_dt[valid_dt_bool] = true;
        }else{
            const entered_datetime = convert_to_datetime($(this).val());
            valid_dt[valid_dt_bool] = !(min_time > entered_datetime || entered_datetime > max_time || entered_datetime.getHours() < EARLIEST || entered_datetime.getHours() + entered_datetime.getMinutes()/60 + entered_datetime.getSeconds()/3600 > LATEST);
            $(this).closest('.input-field-container').find('.input-err-msg').css('opacity', `${valid_dt[valid_dt_bool] ? '0' : '1'}`);
            //console.log(`valid_datetime: ${!(min_time > entered_datetime || entered_datetime > max_time)}`);
            //console.log(`valid_hours: ${!(entered_datetime.getHours() < EARLIEST || entered_datetime.getHours() > LATEST)}`);
        }
        enable_submit_button();
    });

    $(document).on('click', `#${clear_dt_input_btn_id}`, function(event){
        $(this).closest('.input-field-container').find('[name=datetime-input]').val(null);
        valid_dt[valid_dt_bool] = false;
        $(this).closest('.input-field-container').find('.input-err-msg').css('opacity', '0');
        enable_submit_button();
    });
}

function get_relative_path(menu_type){
    const parent_path = 'file:///Users/naga/Library/Mobile%20Documents/com~apple~CloudDocs/PFM%20stuffs/Woodside%20stuff/service-management-dev---servicemanagementdev/web-pages/home/content-pages/catering_orders/Catering-Order.en-US.webpage.copy.html';
    //const parent_path = '${window.location.origin}/Requests/Catering-Order/';
    return `${parent_path}?id=${menu_type['id']}`;
}

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
    return response.map(reponse_data => Object.fromEntries(Object.entries(reponse_data).map(([key, value]) => [key_map[key] || key, value])));
}

function convert_to_datetime(dt_str){
    return new Date(String(dt_str));
}
function clean_white_space(input_string, all=true){
    return input_string.replace(/\s+/g, all ? '' : ' ');
}

function format_datetime_now_standard(){
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let day = today.getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();

    // Add leading zeros to single-digit minutes and day values
    if (minutes < 10) minutes = "0" + minutes;
    if (day < 10) day = "0" + day;
    let twl_hours = hours % 12;
    twl_hours = twl_hours ? twl_hours : 12;

    return String(twl_hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0') + ` ${hours >= 12 ? 'pm': 'am'}` + " " + day + "/" + month + "/" + year;
}