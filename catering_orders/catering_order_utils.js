const CATERING_MENU_UID = new URLSearchParams(window.location.search).get("id");
console.log(`CATERING_MENU_UID: ${CATERING_MENU_UID}`);

const DIGIT_REGEX = new RegExp("^[0-9]+$");
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

function get_relative_path(menu_type){
    const parent_path = 'file:///Users/naga/Library/Mobile%20Documents/com~apple~CloudDocs/PFM%20stuffs/Woodside%20stuff/service-management-dev---servicemanagementdev/web-pages/home/content-pages/catering_orders/Catering-Order.en-US.webpage.copy.html';
    //const parent_path = '${window.location.origin}/Requests/Catering-Order/';
    return `${parent_path}?id=${menu_type['id']}`;
}