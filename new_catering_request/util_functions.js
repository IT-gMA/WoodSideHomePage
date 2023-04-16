const DIGIT_REGEX = new RegExp("^[0-9]+$");
function is_whitespace(str) {
    return !str.trim().length;
}
function is_valid_digit(digit){
    return DIGIT_REGEX.test(digit.trim()) && digit != '' && digit != null;
}

function is_whitespace(str) {
    return !str.trim().length;
}
function extract_integers(input_str){
    if (input_str.match(/\d+/g) == null) return null;
    return parseInt(input_str.match(/\d+/g));
}

function extract_doubles(input_str){
    if (input_str.match(/\d+/g) == null) return null;
    return parseInt(input_str.match(/\d+/g));
}