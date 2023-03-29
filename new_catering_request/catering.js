const CARD_CHILDREN_WIDTH_FACTOR = 0.25;
let CONSUMABLE_MENU_ITEMS = [
    {
        'id': '9a7cb85-49c-ed11-aad1-000d3acb5309',
        'name': 'Full Cream Milk - Fresh (2ltr)',
        'price': 4.07,
        'min_quantity': 1,
        'img_url': 'resources/brownes-full_cream_milk.png',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': '927cb85-49c-ed11-aad1-000d3acb5309',
        'name': 'Peanut Butter - Smooth - Jar (750gm)',
        'price': 10.53,
        'min_quantity': 1,
        'img_url': 'resources/cashew-butter-dark-background.webp',      // dynamic path
        'unit': null,
        'notes': '750 gm',
    },
    {
        'id': '9a7cb85-49c-ed11-aad1-000d3acb5309',
        'name': 'Jam - Raspberry - Jar (500gm)',
        'price': 4.58,
        'min_quantity': 1,
        'img_url': 'resources/jam-jar-raspberry-ground-grey-surface.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': '867cb8f5-f49c-ed11-aad1-000d3acb5309',
        'name': 'Honey - Jar (500gm)',
        'price': 8.44,
        'min_quantity': 1,
        'img_url': 'resources/honey-dripping-from-wooden-spoon.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': '877cb875-f49c-ed11-aad1-000d3acb5309',
        'name': 'Bread Wholemeal - Loaf',
        'price': 2.40,
        'min_quantity': 1,
        'img_url': 'resources/sliced-bread-wood-white-white-table-gray-surface-side-view-space-text.webp',      // dynamic path
        'unit': null,
        'notes': null,
    },
    {
        'id': '8f7cb8f5-f49c-ed11-aad1-000d3acb5309',
        'name': 'Vegemite - Jar (500gm)',
        'price': 10.95,
        'min_quantity': 1,
        'img_url': 'resources/vegemite.png',      // dynamic path
        'unit': null,
        'notes': '',
    },
];
let ADHOC100_MENU_ITEMS = [
    {
        'id': '7599e7a-2e33-ed11-9db1-00224892b273',
        'name': 'Scones with Jam and Cream',
        'price': 2.80,
        'min_quantity': 1,
        'img_url': 'resources/scorns-w-jams-n-cream.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': 'fd56df49-2e33-ed11-9db1-00224892b273',
        'name': 'Whole Gourmet Cake (serves 12 -16)',
        'price': 112.50,
        'min_quantity': 1,
        'img_url': 'resources/whole-gourmet-cake.webp',      // dynamic path
        'unit': null,
        'notes': null,
    },
    {
        'id': 'ea377a78-f39c-ed11-aad1-0022489339ad',
        'name': 'Fresh Fruit Platter',
        'price': 1.02,
        'min_quantity': 1,
        'img_url': 'resources/fruit-platter.webp',      // dynamic path
        'unit': null,
        'notes': '',
        'notes': '',
    },
    {
        'id': 'ea377a78-f39c-ed11-aad1-0022489339ad',
        'name': 'Baguette with assorted fillings',
        'price': 6.80,
        'min_quantity': 1,
        'img_url': 'resources/baguette-w-assorted-fillings.webp',      // dynamic path
        'unit': null,
        'notes': null,
    },
    {
        'id': '17c45e49-2e33-ed11-9db1-002248933ec4',
        'name': 'Antipasto Platter',
        'price': 2.60,
        'min_quantity': 1,
        'img_url': 'resources/antipaso-platter.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': 'e6377a78-139c-ed11-aad1-0022489339ad',
        'name': 'Muffins (Sweet)',
        'price': 2.30,
        'min_quantity': 1,
        'img_url': 'resources/sweet-muffins.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
];
let ADHOC50_MENU_ITEMS = [
    {
        'id': 'ea377a78-f39c-ed11-aad1-0022489339ad',
        'name': 'Wraps with assorted fillings',
        'price': 5.25,
        'min_quantity': 1,
        'img_url': 'resources/wrap-w-assorted-fillings.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': '5aa5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'A Selection of Ribbon Sandwiches',
        'price': 5.70,
        'min_quantity': 1,
        'img_url': 'resources/ribbon-sandwiches.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': 'ea377a78-f39c-ed11-aad1-0022489339ad',
        'name': 'Baguette with assorted fillings',
        'price': 6.80,
        'min_quantity': 1,
        'img_url': 'resources/baguette-w-assorted-fillings.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': '6ea5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'Cheese Platter',
        'price': 1.10,
        'min_quantity': 1,
        'img_url': 'resources/cheese-platter.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': '61a5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': '2lt Orange Juice',
        'price': 6.60,
        'min_quantity': 1,
        'img_url': 'resources/2lt-orange-juice.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': '17c45e49-2e33-ed11-9db1-002248933ec4',
        'name': 'Antipasto Platter',
        'price': 4.00,
        'min_quantity': 1,
        'img_url': 'resources/antipaso-platter.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
];
let ADHOC51_MENU_ITEMS = [
    {
        'id': '61a5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': '2lt Orange Juice',
        'price': 6.60,
        'min_quantity': 1,
        'img_url': 'resources/2lt-orange-juice.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': '5ea5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'Assorted Individual Gourmet Cakes',
        'price': 2.20,
        'min_quantity': 1,
        'img_url': 'resources/individual-gourmet-cakes.webp',      // dynamic path
        'unit': null,
        'notes': null,
    },
    {
        'id': '17c45e49-2e33-ed11-9db1-002248933ec4',
        'name': 'Antipasto Platter',
        'price': 3.80,
        'min_quantity': 1,
        'img_url': 'resources/antipaso-platter.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': 'ea377a78-f39c-ed11-aad1-0022489339ad',
        'name': 'Baguette with assorted fillings',
        'price': 6.80,
        'min_quantity': 1,
        'img_url': 'resources/baguette-w-assorted-fillings.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': '5aa5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'Home Style Cookies',
        'price': 1.80,
        'min_quantity': 1,
        'img_url': 'resources/home-styled-cookies.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
    {
        'id': 'ea377a78-f39c-ed11-aad1-0022489339ad',
        'name': 'Fresh Fruit Platter',
        'price': 1.11,
        'min_quantity': 1,
        'img_url': 'resources/fruit-platter.webp',      // dynamic path
        'unit': null,
        'notes': '',
    },
];

let CYCLONE_SHELTER_MENU_ITEMS = [
    {
        'id': '7ea5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'Sausages',
        'price': 8.81,
        'min_quantity': 20,
        'img_url': 'resources/sausages.webp',      // dynamic path
        'unit': 'KG',
        'notes': 'in kilograms',
    },
    {
        'id': '7ba5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'Tomato',
        'price': 6.78,
        'min_quantity': 5,
        'img_url': 'resources/tomatoes.webp',      // dynamic path
        'unit': 'KG',
        'notes': '',
    },
    {
        'id': '7aa5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'Tuna',
        'price': 1.53,
        'min_quantity': 2,
        'img_url': 'resources/canned-tuna.webp',      // dynamic path
        'unit': 'sets of 12x95gms',
        'notes': 'whole set',
    },
    {
        'id': '78a5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'Yoghurt',
        'price': 1.55,
        'min_quantity': 40,
        'img_url': 'resources/yoghurt.webp',      // dynamic path
        'unit': '150g portion',
        'notes': '',
    },
    {
        'id': '7da5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'Spreads',
        'price': 6.84,
        'min_quantity': 60,
        'img_url': 'resources/butters.webp',      // dynamic path
        'unit': '7g',
        'notes': null,
    },
    {
        'id': '85a5e4b3-fe9c-ed11-aad1-000d3ad215e6',
        'name': 'Fruit - applies, pears, bananas',
        'price': 4.63,
        'min_quantity': 20,
        'img_url': 'resources/fruit-assortment.webp',      // dynamic path
        'unit': '1 box 200PC',
        'notes': '',
    },
];

const HYPOTHETICAL_JSON_DATA = [{
    'id': '85f8652d-5f64-ed11-9561-000d3acc166b',
    'name': 'Consumables',
    'url': 'https://wsservicemanagementuat.powerappsportals.com/Requests/Catering-Order/?id=85f8652d-5f64-ed11-9561-000d3acc166b',
    'title': "<h1>Let's grab some <span class='special-txt'>light</span> and <span class='special-txt'>quick</span> snacks</h1>",
    'sub-title': "<h6>Whether you're looking for a quick snack or a full meal, our consumable food products are the <span class='special-txt'>perfect choice</span> for satisfying hunger and providing sustained energy throughout the day</h6>",
    'html_name': 'consumable',
    'is_regular_menu': true,
    'is_emergency': false,
    'quick_card_menu': CONSUMABLE_MENU_ITEMS,
}, {
    'id': 'baba4017-5f64-ed11-9561-0022489624ee',
    'name': 'Fresh Daily Menu - Week 1',
    'url': 'https://wsservicemanagementuat.powerappsportals.com/Requests/Catering-Order/?id=c09ecc2d-f29c-ed11-aad1-002248114fd7',
    'sub-title': "<h6>Our weekly special rotating menu is perfect for anyone who loves to explore <span>new tastes and flavours</span>. Whether you're a foodie looking for the latest culinary trends, or simply someone who appreciates a great meal, you're sure to find something to love on our rotating menu. And with <span style='color: #F57F25;'>new dishes</span> being added <span style='color: #F57F25;'>every week</span>, there's always a reason to come back for more. We use only the freshest, highest-quality ingredients, and our chefs are always experimenting with new techniques and flavor combinations to create dishes that are truly <span>one-of-a-kind</span>.</h6>",
    'title': "<h1>Check out <span>this week</span> specials!</h1>",
    'img_url': 'resources/arrival-hall-brunch.webp',
    'is_regular_menu': false,
    'is_emergency': false,
    'quick_card_menu': [],
}, {
    'id': 'c09ecc2d-f29c-ed11-aad1-002248114fd7',
    'name': 'Fresh Daily Menu - Week 2',
    'url': 'https://wsservicemanagementuat.powerappsportals.com/Requests/Catering-Order/?id=c09ecc2d-f29c-ed11-aad1-002248114fd7',
    'sub-title': "<h6>If you're looking for a unique and delicious dining experience, look no further than our <span>weekly special menu</span>! Every week, our talented chefs create a mouth-watering menu that features the <span style='color: #F57F25;'>freshest and most flavorful ingredients available</span>. From classic comfort foods to exotic and adventurous dishes, there's something for everyone on our <span>weekly special menu</span>. So gather your friends and family, and join us for an unforgettable dining experience!. Don't miss out on this week's special menu, it's sure to tantalize your taste buds and leave you craving <span>more</span></h6>.",
    'title': "<h1>Check out <span>this week</span> specials!</h1>",
    'img_url': 'resources/pizza-thumbnail-img.webp',
    'is_regular_menu': false,
    'is_emergency': false,
    'quick_card_menu': [],
}, {
    'id': '85f8652d-5f64-ed11-9561-000d3acc166b',
    'name': 'Fresh Daily Menu - Week 3',
    'url': 'https://wsservicemanagementuat.powerappsportals.com/Requests/Catering-Order/?id=c19ecc2d-f29c-ed11-aad1-002248114fd7',
    'sub-title': "<h6>Looking for an exquisite that offers a <span>weekly special rotating</span> menu to spice up your daily meal after a day of hard works? Look no further than our service at Programmed! Our experienced chefs create a <span style='color: #F57F25;'>new and exciting</span> menu each week, featuring a range of delicious dishes inspired by global cuisine. From classic comfort foods to exotic and adventurous flavors, our <span>weekly special menu</span> is the perfect way to break out of your mealtime rut and try something new.</h6>",
    'title': "<h1>Check out <span>this week</span> specials!</h1>",
    'img_url': 'resources/borgar-img-thumbnail.webp',
    'is_regular_menu': false,
    'is_emergency': false,
    'quick_card_menu': [],
}, {
    'id': 'c29ecc2d-f29c-ed11-aad1-002248114fd7',
    'name': 'Fresh Daily Menu - Week 4',
    'url': 'https://wsservicemanagementuat.powerappsportals.com/Requests/Catering-Order/?id=c29ecc2d-f29c-ed11-aad1-002248114fd7',
    'sub-title': "<h6>Looking for a culinary adventure? We are excited to offer a new special menu that rotates <span>every week</span>, providing a fresh and exciting dining experience with each visit. Our team of skilled chefs crafts each dish with care, using only the finest ingredients to create <span>unique and flavorful dishes</span> that will tantalize your taste buds. From bold and spicy to delicate and savory, our rotating menu has something to offer for every palate. Whether you're a foodie or just looking to try something new, our weekly specials are the perfect way to indulge in an <span>unforgettable meal</span>. Don't miss out on the chance to explore a world of flavors and join us for our <span style='color: #F57F25;'>next special menu rotation</span>.</h6>",
    'title': "<h1>Check out <span>this week</span> specials!</h1>",
    'img_url': 'resources/pasta-fettuccine-bolognese-with-tomato-sauce-white-bowl.webp',
    'is_regular_menu': false,
    'is_emergency': false,
    'quick_card_menu': [],
}, {
    'id': 'db7c2127-5f64-ed11-9561-002248933ec4',
    'name': 'Functions - Ad hoc Catering (>100pax)',
    'url': 'https://wsservicemanagementuat.powerappsportals.com/Requests/Catering-Order/?id=db7c2127-5f64-ed11-9561-002248933ec4',
    'title': "<h1>Functions - Ad hoc Catering <span class='special-txt'>(>100pax)</span></h1>",
    'sub-title': "<h6>Indulge in our menu of <span class='special-txt'>generously sized portions</span> that will satisfy your hunger and leave you feeling fully satisfied</h6>",
    'html_name': 'adhoc-100',
    'is_regular_menu': true,
    'is_emergency': false,
    'quick_card_menu': ADHOC100_MENU_ITEMS,
}, {
    'id': '674bdf21-5f64-ed11-9561-0022489334d1',
    'name': 'Functions - Ad hoc Catering (51-100pax)',
    'url': 'https://wsservicemanagementuat.powerappsportals.com/Requests/Catering-Order/?id=674bdf21-5f64-ed11-9561-0022489334d1',
    'title': "<h1>Functions - Ad hoc Catering <span class='special-txt'>(51-100pax)</span></h1>",
    'sub-title': "<h6>Savor our menu of <span class='special-txt'>perfectly proportioned</span> dishes that are delicious and satisfying without leaving you feeling overly stuffed</h6>",
    'html_name': 'adhoc-51',
    'is_regular_menu': true,
    'is_emergency': false,
    'quick_card_menu': ADHOC51_MENU_ITEMS,
}, {
    'id': '200fa41d-5f64-ed11-9561-00224893237a',
    'name': 'Functions - Ad hoc Catering (max 50pax)',
    'url': 'https://wsservicemanagementuat.powerappsportals.com/Requests/Catering-Order/?id=200fa41d-5f64-ed11-9561-00224893237a',
    'title': "<h1>Functions - Ad hoc Catering <span class='special-txt'>(max 50pax)</span></h1>",
    'sub-title': "<h6>Explore our thoughtfully curated selection of <span class='special-txt'>artisanal groceries</span> and enjoy our menu of small plates crafted with the <span class='special-txt'>freshest ingredients</span>, perfect for a light and satisfying meal.</h6>",
    'html_name': 'adhoc-50',
    'is_regular_menu': true,
    'is_emergency': false,
    'quick_card_menu': ADHOC50_MENU_ITEMS,
}, {
    'id': 'fe298b2a-5f64-ed11-9561-000d3aca76e9',
    'name': 'Priority Catering - Cyclone Shelter Catering',
    'url': 'https://wsservicemanagementuat.powerappsportals.com/Requests/Catering-Order/?id=fe298b2a-5f64-ed11-9561-000d3aca76e9',
    'title': "<h1>Priority Catering - <span class='special-txt'>Cyclone Shelter</span> Catering</h1>",
    'sub-title': "<h6>Don't let hunger be a <span class='special-txt'>concern</span> during a cyclone, choose priority food for cyclone shelter</h6><span class='material-symbols-outlined pfm-yellow'>warning</span>",
    'html_name': 'priority',
    'is_regular_menu': false,
    'is_emergency': true,
    'quick_card_menu': CYCLONE_SHELTER_MENU_ITEMS,
},
];

let MY_CART = [
    {},
];

/*const date = new Date();
let _day = date.getDate();
let _month = date.getMonth() + 1;
let _year = date.getFullYear();*/

function _query_nth_week_of_the_month(){
    const today = new Date();
    const nth_week = parseInt(Math.ceil(today.getDate() / 7) - 1);
    //console.log(`Today is in week ${nth_week - 1} of the month.`);
    if (nth_week < 1){
        return 0;
    }
    if (nth_week > 3){
        return 3;
    }
    return nth_week;
}

function _toggle_card_swipe(nxt_btn, prev_btn, card_item, actual_width){
    let _prev_arrow = prev_btn.children().eq(0);
    let _next_arrow = nxt_btn.children().eq(0);

    prev_btn.attr('disabled', card_item.scrollLeft < 1);
    nxt_btn.attr('disabled', card_item.scrollLeft >= actual_width - 10);
}

function _render_card_swipe_btns(preview_item_card_menu_prev_btn_attr, preview_item_card_menu_nxt_btn_attr, prev_btn, nxt_btn ,preview_item_card_menu_div_attr){
    const _item_cards_container = [...document.querySelectorAll(preview_item_card_menu_div_attr)];
    const _item_card_prev_btn = [...document.querySelectorAll(preview_item_card_menu_prev_btn_attr)];
    const _item_card_nxt_btn = [...document.querySelectorAll(preview_item_card_menu_nxt_btn_attr)];
    _item_cards_container.forEach((card_item, index) => {
        let _container_dimension = card_item.getBoundingClientRect();
        let _sub_card_width = _container_dimension.width * CARD_CHILDREN_WIDTH_FACTOR;
        let _prev_arrow = prev_btn.children().eq(0);
        prev_btn.attr('disabled', true);
        let _next_arrow = nxt_btn.children().eq(1);
        const actual_width = card_item.scrollWidth - _container_dimension.width;
        
        _item_card_prev_btn[index].addEventListener('click', (e) => {
            // scroll left i.e decreasing the scroll width
            card_item.scrollLeft -= _sub_card_width;
            console.log(card_item.scrollLeft);
            _toggle_card_swipe(nxt_btn, prev_btn, card_item, actual_width);
        });
        _item_card_nxt_btn[index].addEventListener('click', (e) => {
            // scroll right i.e increasing the scroll width
            card_item.scrollLeft += _sub_card_width;
            console.log(card_item.scrollLeft);
            _toggle_card_swipe(nxt_btn, prev_btn, card_item, actual_width);
        });
    });
}

function _render_weekly_menu(weekly_menu_json){
    // since the html for this special menu type has already been written in the calling html document
    // here only its corresponding menu type content is added
    const _foreground_markup = `${weekly_menu_json['title']}<br>
                            ${weekly_menu_json['sub-title']}<br>
                            <a href='${weekly_menu_json['url']}'>
                                <button type='button' class='btn btn-primary' name='explore-menu-btn' id='explore-menu-btn'>Explore now</button>
                            </a>`;
    $('div[name=weekly-specials-container]').find('.menu-desc').append(_foreground_markup);
    const _background_img_img_markup = "<img src='" + weekly_menu_json['img_url'] + "'>"
    $('div[name=weekly-specials-container]').find('.background-img-container').append(_background_img_img_markup);
}

function _render_regular_menus(regular_menu_list){
    var _item_idx = 0;
    regular_menu_list.forEach((regular_menu) => {
        const _html_name =  regular_menu['html_name'];
        const _containing_section = $('section[name=regular-item-menu-section]');
        // main section container
        const _quick_menu_display_name_attr = _html_name + '-quick-menu-display';
        const _quick_menu_display_name = 'name=' + _quick_menu_display_name_attr;

        // horizontal card menu container
        const _preview_item_card_menu_name_attr = _html_name + '-item-container-menu';
        const _preview_item_card_menu_name = 'name=' + _preview_item_card_menu_name_attr;
        const _preview_item_card_menu_div_attr = '[' + _preview_item_card_menu_name + ']';
        const _preview_item_card_menu_dom_div_name = 'div' + _preview_item_card_menu_div_attr;
        const _preview_item_card_menu_div = $(_preview_item_card_menu_dom_div_name);

        // individual menu item card
        const _preview_item_card_container_name_attr = _html_name + '-item-card';
        const _preview_item_card_container_name = 'name=' + _preview_item_card_container_name_attr;
        const _preview_item_card_container_attr = '[' + _preview_item_card_container_name + ']';
        const _preview_item_card_container_dom_div_name = 'div' + _preview_item_card_container_attr;
        const _preview_item_card_container = $(_preview_item_card_container_dom_div_name);

        // card navigation buttons
        const _preview_item_card_nxt_btn_name_attr = _html_name + '-swipe-next-btn';
        const _preview_item_card_nxt_btn_name = 'name=' + _preview_item_card_nxt_btn_name_attr;
        const _preview_item_card_menu_nxt_btn_attr = '[' + _preview_item_card_nxt_btn_name + ']';
        const _preview_item_card_menu_dom_nxt_btn_name = 'div' + _preview_item_card_menu_nxt_btn_attr;
        const _preview_item_card_menu_nxt_btn= $(_preview_item_card_menu_dom_nxt_btn_name);

        const _preview_item_card_prev_btn_name_attr = _html_name + '-swipe-prev-btn';
        const _preview_item_card_prev_btn_name = 'name=' + _preview_item_card_prev_btn_name_attr;
        const _preview_item_card_menu_prev_btn_attr = '[' + _preview_item_card_prev_btn_name + ']';
        const _preview_item_card_menu_dom_prev_btn_name = 'div' + _preview_item_card_menu_prev_btn_attr;
        const _preview_item_card_menu_prev_btn= $(_preview_item_card_menu_dom_prev_btn_name);

        // even indexed item will have hz-separating-line positioned on the left and right otherwise
        const _hz_separating_line = _item_idx % 2 == 0 ? "<hr class='hz-separating-line'>" : "<hr class='hz-separating-line' style='transform: translateX(-30%);'>";
        //console.log(_preview_item_card_container_name_attr);
        // construct main parent container for horizontal grid, nav buttons, separator and 'view-more' button
        var _markup = `<div class='quick-menu-display' name='${_quick_menu_display_name_attr}'>`;
        // Descriptive texts
        _markup += `${regular_menu['title']}
                    <div class='menu-desc-text'>
                        ${regular_menu['sub-title']}
                    </div><br>`;
        // render the horizontal card menu container
        _markup += _build_preview_menu(regular_menu['quick_card_menu'], _preview_item_card_container_name_attr, _preview_item_card_menu_name_attr, _html_name);
        // card swipe buttons
        _markup += `<div class='card-menu-swiper' name='card-menu-swiper'>
                        <button class='card-menu-swipe-btn' name='${_preview_item_card_prev_btn_name_attr}'>
                            <span class='material-symbols-outlined'>arrow_back_ios</span>
                        </button>
                        <button class='card-menu-swipe-btn' name='${_preview_item_card_nxt_btn_name_attr}'>
                            <span class='material-symbols-outlined'>arrow_back_ios</span>
                        </button>
                    </div><br>
                    <a href='${regular_menu['url']}'>       <!--Link to respective menu content page-->
                        <h5>View all</h5>
                    </a>
                </div>
                ${_hz_separating_line}<br><br>`; 
        // render this menu type content within the section
        $('section[name=regular-item-menu-section]').append(_markup);
        // construct card swiping functionality
        _render_card_swipe_btns(_preview_item_card_menu_prev_btn_attr, _preview_item_card_menu_nxt_btn_attr, _preview_item_card_menu_prev_btn, _preview_item_card_menu_nxt_btn, _preview_item_card_menu_div_attr);
        _item_idx++;
    });
}

function _build_preview_menu(menu_items, preview_item_card_container_name_attr, preview_item_card_menu_name_attr, menu_type){
    var _markup = `<div class='menu-item-container bottom hidden snap-inline' name='${preview_item_card_menu_name_attr}'>`;

    // construct a card container for each item in this menu type
    menu_items.forEach((menu_item) => {
        menu_item['menu_type'] = String(menu_type);
        // for any item that has a metric of unit restriction
        const _unit_metric_markup = menu_item['unit'] == null || menu_item['unit'] == 'Each' ? '<h6 hidden></h6>' : "<h6 style='font-size: 0.8em; padding: 1px;'>" + menu_item['unit'] + "</h6>";
        const _popup_remark = menu_item['notes'] != null && !is_whitespace(menu_item['notes']) ? 
        `<div class='dropdown dropup'>
            <a class='nav-link' id='item-info-dropdown-btn' role='button' data-bs-toggle='dropdown' aria-expanded='false'>
                <span class='material-symbols-outlined' id='info-icon'>info</span>
            </a>
            <ul name='item-info-drop-down' class='dropdown-menu' aria-labelledby='item-info-dropdown-btn' onclick='event.stopPropagation()' id='item-info-dropdown'>
                <div class='popup-content item-info-popup-content' name='popup-content'>
                    <h6>${menu_item['notes']}</h6>
                </div>
            </ul>
        </div>` : 
        `<div class='dropdown'>
        <a class='nav-link' id='item-info-dropdown-btn' role='button' data-bs-toggle='dropdown' aria-expanded='false' style='opacity: 0;'>
            <span class='material-symbols-outlined' id='info-icon'>info</span>
        </a>
        <ul hidden name='item-info-drop-down' class='dropdown-menu' aria-labelledby='item-info-dropdown-btn' onclick='event.stopPropagation()' id='item-info-dropdown'>
            <div class='popup-content item-info-popup-content' name='popup-content'>
                <h6>${menu_item['notes']}</h6>
            </div>
        </ul>
        </div>`;

        // construct the main card body container with its corresponding menu type name given
        _markup += `<div name='${preview_item_card_container_name_attr}' class='item-container'>
                        <p hidden name='item-id'>${menu_item['id']}</p>     <!--0-->
                        <div class='item-img-container'>                    
                            <img id='menu-item-thbn-img' src='${menu_item['img_url']}'>
                        </div>      <!--1-->
                        <!--Name/description and price-->
                        <div class='menu-item-desc'>
                            <h6 id='menu-item-title' class='menu-item-title'>${menu_item['name']}</h6>      <!--0-->
                            ${_unit_metric_markup}                                                          <!--1-->
                            <h6>$${parseFloat(menu_item['price']).toFixed(2)}</h6>                          <!--2-->
                            ${_popup_remark}                                                                <!--3-->
                        </div>      <!--2-->
                        <div class='item-input-container'>
                            <div>
                                <input name='item-quantity-input' 
                                        class='item-quantity-input' 
                                        placeholder='at least ${menu_item['min_quantity']}'>                <!--0-->
                                <i class='input-err-msg'>Must be at least ${menu_item['min_quantity']}</i>  <!--1-->
                                <p hidden name='min-item-quantity'>${menu_item['min_quantity']}</p>         <!--2-->
                                <p hidden name='float-price'>${parseFloat(menu_item['price'])}</p>           <!--3-->
                            </div>
                        </div>      <!--3-->
                        <button disabled type='button' class='btn btn-primary' 
                                name='add-to-cart-btn' confirm='Are your sure?' 
                                id='add-to-cart-btn'>Add to cart
                        </button>   <!--4-->
                        <i hidden>${menu_item['menu_type']}</i>     <!--5-->
                        <h6 hidden>${menu_item['notes']}</h6>       <!--6-->
                    </div>`;
    });
    _markup += "</div><br>";
    return _markup
}

function disable_individual_btn(btn, valid_cond){
    //console.log(btn);
    btn.attr('disabled', !valid_cond);
}

function _add_to_cart(item_name, item_id, menu_type, item_price, selected_quantity){
    var _matched_item = null;
    // check whether this item already exists in the cart
    MY_CART.forEach(function(cart_item){
        if (cart_item['id'] == item_id && cart_item['name'] == item_name && cart_item['price'] == parseFloat(item_price)){
            _matched_item = cart_item;
            cart_item['ordered_quantity'] += selected_quantity;
            cart_item['total_price'] += parseFloat(parseInt(selected_quantity) * parseFloat(item_price));
        }
    });
    if (_matched_item != null){
        // existing item has already been added above thus making the variable _matched_item not null -> halts the function
        return;
    }
    // this item doesn't exist in the cart
    MY_CART.push({
        'id': item_id,
        'name': item_name,
        'price': parseFloat(item_price),
        'menu_type': menu_type,
        'ordered_quantity': parseInt(selected_quantity),
        'total_price': parseFloat(parseInt(selected_quantity) * parseFloat(item_price)),
    });
}


/*async*/ function _retrieve_resources(){
    /*let {data: REGULAR_MENU_JSON, error0} = await HYPOTHETICAL_JSON_DATA.filter((menu_type) => menu_type['is_regular_menu'] && !menu_type['is_emergency']);
    let {data: WEEKLY_MENU_JSON, error1} = await HYPOTHETICAL_JSON_DATA.filter((menu_type) => !menu_type['is_regular_menu'] && !menu_type['is_emergency'])[_query_nth_week_of_the_month()];
    let {data: PRIORITY_MENU_JSON, error2} = await HYPOTHETICAL_JSON_DATA.filter((menu_type) => !menu_type['is_regular_menu'] && menu_type['is_emergency']);*/
    const REGULAR_MENU_JSON = HYPOTHETICAL_JSON_DATA.filter((menu_type) => menu_type['is_regular_menu'] && !menu_type['is_emergency']);
    const WEEKLY_MENU_JSON = HYPOTHETICAL_JSON_DATA.filter((menu_type) => !menu_type['is_regular_menu'] && !menu_type['is_emergency'])[_query_nth_week_of_the_month()];
    const PRIORITY_MENU_JSON = HYPOTHETICAL_JSON_DATA.filter((menu_type) => !menu_type['is_regular_menu'] && menu_type['is_emergency']);
    return [REGULAR_MENU_JSON, WEEKLY_MENU_JSON, PRIORITY_MENU_JSON];
    //return Promise.resolve([REGULAR_MENU_JSON, WEEKLY_MENU_JSON, PRIORITY_MENU_JSON]);
}

function _render_body_content(args){
    const REGULAR_MENU_JSON = args[0]; //HYPOTHETICAL_JSON_DATA.filter((menu_type) => menu_type['is_regular_menu'] && !menu_type['is_emergency']);
    const WEEKLY_MENU_JSON = args[1]; //HYPOTHETICAL_JSON_DATA.filter((menu_type) => !menu_type['is_regular_menu'] && !menu_type['is_emergency'])[_query_nth_week_of_the_month()];
    const PRIORITY_MENU_JSON = args[2]; //HYPOTHETICAL_JSON_DATA.filter((menu_type) => !menu_type['is_regular_menu'] && menu_type['is_emergency']);

    _render_weekly_menu(WEEKLY_MENU_JSON);
    _render_regular_menus(REGULAR_MENU_JSON);
    _render_regular_menus(PRIORITY_MENU_JSON);
}

// Animation control
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {entry.isIntersecting ? entry.target.classList.add('show') : entry.target.classList.remove('show');});
});
// End of animation controls

$(document).ready(function () {
    //const today_date = _day + '/' + _month + '/' + _year;
    /*_retrieve_resources().then(
        (args) => _render_body_content(args)
    );*/
    _render_body_content(_retrieve_resources());

    // render document animations
    document.querySelectorAll('.hidden').forEach((elem) => {observer.observe(elem);});

    // styling minor elements
    $('.input-err-msg').css('color', 'transparent');
    // rotate each next nav arrow icon 180º i.e make it point to the right
    $('div[name=card-menu-swiper]').each(function() {$(this).children().eq(1).children().eq(0).css('transform', 'rotate(180deg)');});
    // adjust each menu item's title/name a bold font weight
    $('.menu-item-desc').each(() => $(this).children().eq(0).css('font-weight', 'bold'));

    $(document).on('keyup', 'input[name=item-quantity-input]', function (e) {
        !DIGIT_REGEX.test($(this).val()) ? $(this).val(null) : null;

        const _valid_digit = is_valid_digit($(this).val());
        console.log(_valid_digit);
        const _parent_div = $(this).parent();

        if ($(this).val() && _valid_digit){
            parseInt($(this).val()) >= parseInt(_parent_div.children().eq(2).text()) ? _parent_div.children().eq(1).css('color', 'transparent') : _parent_div.children().eq(1).css('color', 'red');
        }else{
            _valid_digit || !$(this).val() ? _parent_div.children().eq(1).css('color', 'transparent') : _parent_div.children().eq(1).css('color', 'red');
        }
        disable_individual_btn(_parent_div.parent().parent().children().eq(4), _valid_digit && parseInt($(this).val()) >= parseInt(_parent_div.children().eq(2).text()));
    });

    $(document).on('click', 'button[name=add-to-cart-btn]', function(e) {
        $(this).attr('disabled', true);        
        const _parent_div = $(this).parent();
        const _input_div = _parent_div.children().eq(3).children().eq(0);

        const _selected_quantity = parseInt(_input_div.children().eq(0).val());
        const _item_id = _parent_div.children().eq(0).text();
        const _item_name = _parent_div.children().eq(2).children().eq(0).text();
        const _menu_type = _parent_div.children().eq(5).text();
        const _item_price = parseFloat(_input_div.children().eq(3).text());
        //console.log(_selected_quantity);
        //console.log(_item_name);
        _add_to_cart(_item_name, _item_id, _menu_type, _item_price, _selected_quantity);
        // clear existing inputs
        _input_div.children().eq(0).val(null);
        MY_CART.forEach((cart_item) => {console.log(cart_item)});
        alert(`${_selected_quantity} of ${_item_name} has been added to your shopping cart`);
    });
    /*const _item_cards_container = [...document.querySelectorAll('[name=consumable-item-container-menu]')];
    const _item_card_prev_btn = [...document.querySelectorAll('[name=consumable-swipe-prev-btn]')];
    const _item_card_nxt_btn = [...document.querySelectorAll('[name=consumable-swipe-next-btn]')];
    _item_cards_container.forEach((card_item, index) => {
        let _container_dimension = card_item.getBoundingClientRect();
        let _sub_card_width = _container_dimension.width * CARD_CHILDREN_WIDTH_FACTOR;
        let _prev_arrow = $('button[name=consumable-swipe-prev-btn]').children().eq(0);
        $('button[name=consumable-swipe-prev-btn]').attr('disabled', true);
        let _next_arrow = $('button[name=consumable-swipe-next-btn]').children().eq(1);
        const actual_width = card_item.scrollWidth - _container_dimension.width;
        
        _item_card_prev_btn[index].addEventListener('click', (e) => {
            card_item.scrollLeft -= _sub_card_width;
            console.log(card_item.scrollLeft);
            _toggle_card_swipe($('button[name=consumable-swipe-next-btn]'), $('button[name=consumable-swipe-prev-btn]'), card_item, actual_width);
        });
        _item_card_nxt_btn[index].addEventListener('click', (e) => {
            card_item.scrollLeft += _sub_card_width;
            console.log(card_item.scrollLeft);
            _toggle_card_swipe($('button[name=consumable-swipe-next-btn]'), $('button[name=consumable-swipe-prev-btn]'), card_item, actual_width);
        });
    });*/
});