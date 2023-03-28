const DIGIT_REGEX = new RegExp("^[0-9]+$");
function is_whitespace(str) {
    return !str.trim().length;
}
function is_valid_digit(digit){
    return DIGIT_REGEX.test(digit.trim()) && digit != '' && digit != null;
}