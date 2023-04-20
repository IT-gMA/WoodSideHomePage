// retrieve user id
function get_user_id(){
    const elem_user_id = '{{user.id}}';
    return elem_user_id.includes('{{') && elem_user_id.includes('}}') ? '70acd4d5-2e15-4b48-9145-f4caf659eb31' : elem_user_id;
}
const USER_ID = get_user_id(); 

const transition_delay = 200; // ms
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        //console.log(entry);
        entry.isIntersecting ? entry.target.classList.add('show-animate') : entry.target.classList.remove('show-animate');
        //entry.isIntersecting ? console.log('seen') : console.log('out of sight');
    });
});

const hidden_elems = document.querySelectorAll('.hidden-animate');

hidden_elems.forEach((elem) => {
    observer.observe(elem);
});

function _style_elem_transition_delay(css_target, this_elem_transition_delay){
    this_elem_transition_delay += 'ms';
    $(css_target).css('transition-delay', this_elem_transition_delay);
}
    
$('.service-nav-btn').each((idx) => {
    var this_elem_transition_delay = transition_delay + idx * 100;
    _style_elem_transition_delay(_format_elem_nth_child('.service-nav-btn', idx), this_elem_transition_delay);
});

function _render_service_div_animation(){
    $('div[name=service-div]').each((idx) => {
        var this_elem_transition_delay = transition_delay*1.5 - (idx * 40);
        _style_elem_transition_delay(_format_elem_nth_child('.service-div', idx), this_elem_transition_delay);
    });
}

function _format_elem_nth_child(elem, idx) {return String(elem) + ':nth-child(' + String(idx) + ')';}
//$('#rohin-art-work-txt-subst').hide();
_render_service_div_animation();
$(document).ready(function(){
    $('div[name=service-div]').each(function (idx) {
        var this_elem_transition_delay = transition_delay - (idx * 50);
        //console.log('idx: ' + idx + '--' + $(this).find('h6').text() + ', delayed: ' + this_elem_transition_delay + ' ms');
    });
    $('#rohin-art-work-txt-subst').append("I’d like to begin by acknowledging the Traditional Owners of the land on which we meet today, the (people) of the (nation) and pay my respects to Elders past and present.<br><br>---- Programmed artwork by Rohin Kickett ----");
    $(document).on('mouseover', '.extra-service-offer-container', function(e){
        $('div[name=service-div]').each(function(){
            $(this).children().eq(0).css('transition', '.3s ease-in-out !important');
            $(this).css('transition', '.3s ease-in-out !important');
        });
    });
    $(document).on('mouseleave', '.extra-service-offer-container', function(e){
        console.log('slow down');
        _render_service_div_animation();
    });
});