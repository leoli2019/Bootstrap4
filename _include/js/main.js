
/* production switcher */
let isProduct = false;
let cloudMaintenance = false;

/* API list */
const priceUrl = "https://api.coinbene.com/v1/market/ticker?symbol=";
const BTCUrl = "https://api.coindesk.com/v1/bpi/currentprice/USD";
const apiUrl = isProduct ? "https://nbai.io/orionrest" : "http://192.168.88.216:8081/orionrest";
// for leycloak of header
let dashboardUrl = isProduct ? 'https://nbai.io/dashboard/#/' : 'http://192.168.88.216:8080/dashboard/#/';
let regisUrl = isProduct ? 'https://auth.nbai.io/auth/realms/orion/protocol/openid-connect/registrations?client_id=orion-web&response_type=code&scope=openid email&redirect_uri=https://nbai.io/dashboard/#/profile&kc_locale=en' : 'http://192.168.88.230:8080/auth/realms/orion/protocol/openid-connect/registrations?client_id=orion-web&response_type=code&scope=openid%20email&redirect_uri=http://192.168.88.216:8080/orion-dashboard-boot/&kc_locale=en';
let keyUrl = dashboardUrl + 'profile';
let logoutUrl = dashboardUrl + 'logout';
let conTypeUrl = apiUrl + '/contact_type';
let contactUrl = apiUrl + '/customers/contactInfo';
let profileUrl = dashboardUrl + '/profile';
let dashUrl = dashboardUrl + '/';

if (cloudMaintenance) {
    regisUrl = keyUrl = './maintenance.html';
}


$('#keyCloak').attr('href', keyUrl);
$('#loginUserLog').attr('href', keyUrl);
$('#userDash').attr('href', dashboardUrl);
$('.login').attr('href', keyUrl);
$('.signUp').attr('href', regisUrl);

/* Price page */
// let zone = 'mtl01';
// let zones;
// let ledgerIp;
// let category = 'micro';

let currency = [];
let priceArr = [];
let rate = 0.001;
let notebookPrice;
let storageBasicPrice = 0.75;
let storageAddOnPrice = 0.25;


$('document').ready(function () {
    // getCategory();
    autoHeight();
    gotoTab();
    // fillStorageForm();
});

/* Switch tab */

function switchTab(item, idName) {
    console.log('click', item);
    $('.tab-text').removeClass('active');
    $(item).addClass('active');
    $('.tabContent').addClass('hide');
    $(idName).removeClass('hide');
}

/* goto pages specific tab */
function gotoTab() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    let tab = url.searchParams.get("open");
    // console.log('url', tab);
    if (tab) {
        // console.log('has tab');
        let idName = '#' + tab;
        let idTabName = idName + 'Tab';
        // console.log('name', idName, idTabName);
        switchTab($(idTabName), idName);
    }
}


/* Language switch style change */
function language() {
    let lang = localStorage.getItem('lang');
    if (lang == 'en') {
        $(".lang-en").css('display', 'block');
        $(".lang-ch").css('display', 'none');
    }
    if (lang == 'ch') {
        $(".lang-ch").css('display', 'block');
        $(".lang-en").css('display', 'none');
    }
}

/* Adjust sections height in different screen' */
function autoHeight() {
    let headerHeight = $('nav').outerHeight(true);
    let footerHeight = $('footer').outerHeight(true);
    let windowHeight = $(window).height();
    let contentHeight = $('.maintenance .second-section .container').outerHeight(true);
    // console.log('headerheight', headerHeight, footerHeight, windowHeight);

    let pageWidth = $(window).width();
    let firstTextHeight = $('.subPage .first_section .container').outerHeight();
    let homeFirstTextHeight = $('.home .first_section .container h1').outerHeight() + $('.home .first_section .container .content').outerHeight();
    let padding = (pageWidth / 1336 * 205 - firstTextHeight) / 2;
    let homePadding = (pageWidth / 1335 * 500 - homeFirstTextHeight) / 2;
    let maintenancePadding = (windowHeight - headerHeight - footerHeight - contentHeight) / 2;
    $('.maintenance .second-section .container').css({ 'padding-top': maintenancePadding + 'px', 'padding-bottom': maintenancePadding + 'px' })
    // console.log('width', headerHeight);
    // $('.subPage .section').css({ 'position': 'relative', 'top': headerHeight + 'px' });
    // $('.subPage footer').css({ 'position': 'relative', 'top': headerHeight + 'px' });
    // $('.home .section').css({ 'position': 'relative', 'top': headerHeight + 'px' });
    // $('.home footer').css({ 'position': 'relative', 'top': headerHeight + 'px' });

    if (pageWidth > 481) {
        let imageHeight = $('.home .third-section .solution .image').outerHeight();
        let textHeight = $('.home .third-section .solution .text h3').outerHeight() + $('.home .third-section .solution .text p').outerHeight();
        // console.log('image height', imageHeight, textHeight);
        let textPadding = (imageHeight - textHeight) / 2;
        $('.home .third-section .solution .text').css({ 'padding-top': textPadding + 'px', 'padding-bottom': textPadding + 'px' });
        $('.home .first_section .container').css({ 'padding-top': homePadding + 'px', 'padding-bottom': homePadding + 'px' });
    }
    else {
        $('.home .first_section .container').css({ 'padding-top': '5rem', 'padding-bottom': '5rem' });
        $('.home .third-section .solution .text').css({ 'padding-top': '3rem', 'padding-bottom': '5rem' });
    }
    if (pageWidth > 981) {
        $('.subPage .first_section .container').css({ 'padding-top': padding + 'px', 'padding-bottom': padding + 'px' });
    }
    else {
        $('.subPage .first_section .container').css({ 'padding-top': '5rem', 'padding-bottom': '5rem' });
    }
}


/* Waypoint for home page sections anmiation */
$('body.home .sections .row').waypoint(function () {
    // console.log('sections', $(this.element));
    $(this.element).addClass('moveUp');
}, { offset: '80%' });


/* pricing page MLS functions' */
function getPricing(type, id) {
    let language_id = 39;
    let url = apiUrl + '/products/get_products?page=1&size=1000';
    let pricingId = '#' + type + 'Pricing';
    let priceId = type + 'Price';
    let calculatorId = '#' + type + 'Calculator';
    let categoryId = '#' + type + 'Category';
    let calculatorPriceId = '#calculator' + type[0].toUpperCase() + type.slice(1) + 'Price';
    priceArr[type] = [];
    let data = {
        id: "",
        sku: "",
        start_price: "",
        end_price: "",
        is_bundle: "",
        note: "",
        is_promoting: "",
        taxable: "",
        active: true,
        deleted: false,
        customer_visible: true,
        start_createdAt: "",
        end_createdAt: "",
        category_id: id,
        shop_id: 403,
        language_id: language_id
    }
    let dataStr = JSON.stringify(data);
    // console.log('para', type, id);
    console.log('get pricing', type, id, data);
    $.ajax({
        type: 'POST',
        url: url,
        data: dataStr,
        success: function (res) {
            console.log('pricing', res);
            if (res && res['code'] == 200 && res['data']) {
                if (res['data']['content']) {
                    let products = res['data']['content'];
                    // console.log('products', products);
                    products.forEach((product, index) => {
                        // console.log('product', product);
                        let price = product['price'];
                        let unit = '';
                        if (price == 0) {
                            price = 'free';
                        } else {
                            price = product['price'].toFixed(2);
                            unit = '$/h';
                        }
                        $(pricingId).append(
                            '<div class="body row d-lg-flex">' +
                            '<div class="col-3 text-left translate-prform-subitem21 leftpadding">' +
                            product['name'] +
                            '</div>' +
                            '<div class="col-7 text-left descriptions">' +
                            product['description'].replace(/,/g, '<br/>') +
                            '</div>' +
                            '<div class="col-2 text-center" id="' + priceId + index + '">' +
                            '<span class="number mPrice">' +
                            price +
                            '</span>' +
                            '<span class="unit">' +
                            unit +
                            '</span>' +
                            '</div>' +
                            '</div>'
                        )
                        $(calculatorId + ' ' + categoryId).append(
                            '<option value = "' + index + '">' +
                            product['name'] +
                            '</option>'
                        )
                        priceArr[type].push(product['price'].toFixed(2));
                    })
                    $(calculatorPriceId + ' .number').html(products[0]['price']);
                    let unit = products[0]['price'] == 0 ? '' : '$/h';
                    $(calculatorPriceId + ' .unit').html(unit);
                    // currency[type] = true;
                    $('.hourNumber').keyup();
                    // console.log('priceArr', priceArr);
                }
            }
        },
        contentType: 'application/json',
        dataType: 'json'
    });
}


// function getStoragePricing(){
//     $.ajax({
//         type: 'GET',
//         url: apiUrl + '/products/gs2?shop_id=403&language_id=39',
//         data: {},
//         success: function (res) {
//             // console.log('storageprice', res);
//             if (res && res['code'] == 200 && res['data']) {
//                 if (res['data']) {
//                     gs2PriceUSD = [];
//                     gs2PriceNBAI = [];
//                     let products = res['data'];
//                     // console.log('products', products);
//                     products.forEach((product, index) => {
//                         // console.log('product', product);
//                         $('#GS2Pricing').append(
//                             '<div class="body row d-lg-flex">' +
//                             '<div class="col-3 text-left translate-prform-subitem21 leftpadding">' +
//                             product['name'] +
//                             '</div>' +
//                             '<div class="col-7 text-left descriptions">' +
//                             product['description'].replace(/,/g, '<br/>') +
//                             '</div>' +
//                             '<div class="col-2 text-center" id="price' + index + '">' +
//                             '<span class="number mPrice">' +
//                             product['price'].toFixed(2) +
//                             '</span>' +
//                             '<span class="unit">' +
//                             '$/h' +
//                             '</span>' +
//                             '</div>' +
//                             '</div>'
//                         )
//                         $('#MLSCalculator #category').append(
//                             '<option value = "' + index + '">' +
//                             product['name'] +
//                             '</option>'
//                         )
//                         gs2PriceUSD.push(product['price'].toFixed(2));
//                         gs2PriceNBAI.push(parseFloat(product['price']) / rate).toFixed(2);
//                     })
//                     // $('#calculatorPrice .number').html(products[0]['price']);

//                 }
//             }
//         },     
//         contentType: 'application/json',
//         dataType: 'json'
//     });
// }
/* Currency change event */

$('.currencySwitch').change(function () {
    let id = $(this).attr('id');
    let type = id.substring(0, id.indexOf('Currency'));
    // console.log('id', type);
    // zone = $('#location').val();
    currency[type] = $(this).is(":checked");
    // console.log(currency);
    fillForm(type);
});

// $('#notebookCurrencySwitch').change(function () {
//     notebookCurrency = $(this).is(":checked");
//     fillForm('notebook');
// });

// $('#storageCurrencySwitch').change(function () {
//     storageCurrency = $(this).is(":checked");
//     fillStorageForm();
// });


$('.hourNumber').keyup(function () {
    let id = $(this).attr('id');
    let type = id.substring(0, id.indexOf('Hour'));
    // console.log('type', id, type);
    calculate(type);
});

// $('#notebookHourNumber').keyup(function () {
//     calculate('notebook');
// });

$('#storageAddOnNumber').keyup(function () {
    // console.log('run storage', storageCurrency);
    let space = parseInt($(this).val());
    let basicPrice = parseFloat($('#calculatorStorageBasicPrice .number').html());
    let addOnPrice = parseFloat($('#calculatorStorageAddOnPrice .number').html());
    // console.log('price', space, basicPrice, addOnPrice);
    if (space || space === 0) {
        let total = (Math.ceil(space / 5) * addOnPrice + basicPrice).toFixed(2);
        // console.log('total', total);
        if (storageCurrency) {
            $('#storageTotal').html(total + '$');
        }
        if (!storageCurrency) {
            $('#storageTotal').html(total + 'NBAI');
        }
        if ($(this).val() == null || $(this).val() == "" || $(this).val() == undefined) {
            $('#storageTotal').html(storageBasicPrice + '$');
        }
    }
});

function getCategory() {
    let url = apiUrl + '/category/get?page=1&size=1000'
    let data = {};
    let dataStr = JSON.stringify(data);
    $.ajax({
        type: 'POST',
        url: url,
        data: dataStr,
        success: function (res) {
            console.log('category', res['data']);
            if (res && res['code'] == 200 && res['data']['content']) {
                res['data']['content'].forEach(element => {
                    let refId = element.ref_id;
                    if (refId == 'hmV87' || refId == 'bRqYw') {
                        // console.log('name', name);
                        getPricing(refId, element.id);
                        fillForm(refId);
                        currency[refId] = true;
                    }
                });
            }
        },
        contentType: 'application/json',
        dataType: 'json'
    });
    console.log('getCategory done');
}

function calculate(type) {
    console.log('calculate', type);
    let calculatorId = '#calculator' + type[0].toUpperCase() + type.slice(1) + 'Price .number';
    let totalId = '#' + type + 'Total';
    let hourId = '#' + type + 'HourNumber';
    let hour = parseFloat($(hourId).val()) * 10;
    let price = parseFloat($(calculatorId).html())
    // console.log('price', hour, price);
    if (hour || hour === 0) {
        let total = (hour * price / 10).toFixed(2);
        // console.log('total', total, currency);
        if (currency[type]) {
            $(totalId).html(total + ' $');
        }
        if (!currency[type]) {
            $(totalId).html(total + ' NBAI');
        }
        // if ($(this).val() == null || $(this).val() == "" || $(this).val() == undefined) {
        //     $(totalId).html(0.00 + ' $');
        // }
    }
}

function categoryChange(type, index) {
    // console.log('index', index);
    let placeId = '#calculator' + type[0].toUpperCase() + type.slice(1) + 'Price';
    let hourId = '#' + type + 'HourNumber';
    let number = placeId + ' .number';
    let unit = placeId + ' .unit';
    let price, unitText;
    if (currency[type]) {
        price = priceArr[type][index];
        unitText = ' $/h';
    }
    else {
        price = (parseFloat(priceArr[type][index]) / rate).toFixed(2);
        unitText = ' NBAI/h';
    }
    $(number).html(price);
    $(unit).html(unitText);
    $(hourId).keyup();
}


function fillForm(type) {
    let priceId = '#' + type + 'Price';
    let categoryId = '#' + type + 'Category';
    // console.log('ids', priceId, categoryId);
    let unitText, price;
    // console.log('isCurrency', type, priceArr[type]);
    priceArr[type].forEach((price, index) => {
        let number = priceId + index + ' .number';
        let unit = priceId + index + ' .unit';
        // console.log('index', type, priceArr[type][index]);
        // console.log('number', number, unit);
        if (currency[type]) {
            price = priceArr[type][index];
            unitText = ' $/h';
            if (price == 0) {
                price = 'free';
                unitText = '';
            }
        }
        else {
            price = (parseFloat(priceArr[type][index]) / rate).toFixed(2);
            unitText = ' NBAI/h';
            if (price == 0) {
                price = 'free';
                unitText = '';
            }
        }
        $(number).html(price);
        $(unit).html(unitText);
    })
    $(categoryId).change();
}


// function fillNotebookForm() {
//     notebookPriceUSD.forEach((price, index) => {
//         let number = '#notebookPrice' + index + ' .number';
//         let unit = '#notebookPrice' + index + ' .unit';
//         if (notebookCurrency) {
//             $(number).html(price);
//             $(unit).html(' $/h');
//         }
//         else {
//             $(number).html(notebookPriceNBAI[index]);
//             $(unit).html(' NBAI/h');
//         }
//     })
//     $('#notebookCategory').change();
//     // if (!notebookCurrency) {
//     //     $('#calculatorNotebookPrice .number').html(notebookPrice / rate);
//     //     $('#calculatorNotebookPrice .unit').html('NBAI/h');
//     //     $('#notebookPrice .number').html(notebookPrice / rate);
//     //     $('#notebookPrice .unit').html('NBAI/h');
//     //     $('#notebookHourNumber').keyup();
//     // }
//     // else {
//     //     $('#calculatorNotebookPrice .number').html(notebookPrice);
//     //     $('#calculatorNotebookPrice .unit').html('$/h');
//     //     $('#notebookPrice .number').html(notebookPrice);
//     //     $('#notebookPrice .unit').html('$/h');
//     //     $('#notebookHourNumber').keyup();
//     // }
// }


function fillStorageForm() {
    // console.log(category);
    if (!storageCurrency) {
        $('#calculatorStorageBasicPrice .number').html(storageBasicPrice / rate);
        $('#calculatorStorageBasicPrice .unit').html('NBAI');
        $('#calculatorStorageAddOnPrice .number').html(storageAddOnPrice / rate);
        $('#calculatorStorageAddOnPrice .unit').html('NBAI');
        $('#storageBasicPrice .number').html(storageBasicPrice / rate);
        $('#storageBasicPrice .unit').html('NBAI');
        $('#storageBasicTotal').html(storageBasicPrice / rate + 'NBAI');
        $('#storageAddOnNumber').keyup();
    }
    else {
        $('#calculatorStorageBasicPrice .number').html(storageBasicPrice);
        $('#calculatorStorageBasicPrice .unit').html('$');
        $('#calculatorStorageAddOnPrice .number').html(storageAddOnPrice);
        $('#calculatorStorageAddOnPrice .unit').html('$');
        $('#storageBasicPrice .number').html(storageBasicPrice);
        $('#storageBasicPrice .unit').html('$');
        $('#storageBasicTotal').html(storageBasicPrice + '$');
        $('#storageAddOnNumber').keyup();
        // $('#category').change();
    }
}




$('document').ready(function () {
    // $.ajax({
    //     type: 'GET',
    //     url: apiUrl + '/ledger/ledgerList',
    //     data: {},
    //     success: function (res) {
    //         if (res) {
    //             // for (let i = 0; i < res.length; i++) {
    //             // console.log('res1', res);
    //             // console.log('ledgers',ledgers, ledgers[i].company);
    //             // $(".ledgerName").html(ledgers[i].company);
    //             // $(".ledgerName1").html(ledgers[0].company);
    //             // $(".ledgerName2").html(ledgers[1].company);
    //             res.forEach(element => {
    //                 let ledgerStatus = { 'name': '', 'workersCount': 0, 'tasksCount': 0 }
    //                 ledgerStatus.name = element.company;
    //                 let ip = element['ip'].substring(0, element['ip'].indexOf(':'));
    //                 $.ajax({
    //                     type: 'GET',
    //                     url: apiUrl + '/superLedger/taskcount/ledgerip/' + ip,
    //                     data: {},
    //                     success: function (res) {
    //                         if (res) {
    //                             // console.log('task', res);
    //                             ledgerStatus['tasksCount'] = res.body.result;
    //                             $.ajax({
    //                                 type: 'GET',
    //                                 url: apiUrl + '/mem/worker/' + ip,
    //                                 data: {},
    //                                 success: function (res) {
    //                                     if (res) {
    //                                         // console.log('worker', res);
    //                                         ledgerStatus['workersCount'] = res.body.length;
    //                                         $('#ledgerlist table tbody').append(
    //                                             '<tr><td class="ledgerName">' + ledgerStatus.name + '</td>' +
    //                                             '<td class="worker">' + ledgerStatus.workersCount + '</td>' +
    //                                             '<td class="taskCount">' + ledgerStatus.tasksCount + '</td></tr>'
    //                                         )
    //                                         // console.log('wo', ledgerStatus['workersCount']);

    //                                     }
    //                                 },
    //                                 contentType: 'application/json',
    //                                 dataType: 'json'
    //                             });
    //                             // console.log('ta',  ledgerStatus['tasksCount']);                              
    //                         }
    //                     },
    //                     contentType: 'application/json',
    //                     dataType: 'json'
    //                 });
    //             });
    //         }
    //     },
    //     contentType: 'application/json',
    //     dataType: 'json'
    // });

    let token = localStorage.getItem('token');
    // console.log('token', token);
    if (token) {
        $.ajax({
            // url: apiUrl + '/userProfile',
            url: apiUrl + '/user',
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            data: {},
            success: function (data) {
                console.log('data', data);
                // let firstName = data.customer ? data.customer.firstName : data.ledger.firstName;
                let firstName = data.data.firstName;
                let returnUrl = data.customer ? 'dashboard/#/profile' : 'dashboard/#/ledger/index';
                $('#loginForm').addClass('hide');
                $('#loginMobile').addClass('hide');
                $('#loginMobileP').addClass('hide');
                $('#myaccount').addClass('hide');
                $('#loginUserLog').addClass('hide');
                $('#loginUserSign').addClass('hide');
                $('#userName').html(firstName + ' ');
                $('#userinfo').removeClass('hide');
                $('#hi').removeClass('hide');
                $('#userName').removeClass('hide');
                $('#userDash').removeClass('hide');
                $('#userStatus').removeClass('hide');
                // $('#userDash').attr('href', returnUrl);
                $('#loginUser').attr('href', 'dashboard/#/profile');
            },
            error: function (err) {
                $('#loginForm').removeClass('hide');
                $('#loginMobile').removeClass('hide');
                $('#loginMobileP').removeClass('hide');
                $('#userinfo').addClass('hide');
                $('#hi').addClass('hide');
                $('#userName').addClass('hide');
                $('#userDash').addClass('hide');
                $('#userStatus').addClass('hide');
                // $('#loginUser').html('Sign in');
                $('#loginUser').attr('href', 'dashboard/#/profile');
                console.log(err);
            }
        })
    }
    else {
        $('#loginForm').removeClass('hide');
        $('#loginMobile').removeClass('hide');
        $('#loginMobileP').removeClass('hide');
        $('#loginUserLog').removeClass('hide');
        $('#loginUserSign').removeClass('hide');
        // $('#loginUserLog').html('Sign in');
        // $('#loginUserSign').html('Sign up');
        $('#loginUser').attr('href', 'dashboard/#/profile');
    }
})

function loginEnter(e) {
    let pass = e.which || e.keyCode;
    console.log('ee', pass);
    if (pass === 13) {
        login('ai');
    }
}

function logout() {
    let currentPath = window.location.href;
    // console.log('path',logoutUrl + "?" + currentPath);
    window.open(logoutUrl + "?return=" + currentPath, '_self');
    localStorage.removeItem('token');
    localStorage.clear();
    $('#loginForm').removeClass('hide');
    $('#loginUserLog').removeClass('hide');
    $('#loginUserSign').removeClass('hide');
    $('#loginMobile').removeClass('hide');
    $('#loginMobileP').removeClass('hide');
    $('#hi').addClass('hide');
    $('#userName').addClass('hide');
    $('#userDash').addClass('hide');
    $('#userStatus').addClass('hide');
}

// $('#location').change(function () {
//     zone = $(this).val();
//     currency = $('#box1').is(":checked");
//     fillForm(zone, currency);
// });


/* login in */
let url = apiUrl + '/get_access_token';
// let data = {};
let userName = localStorage.getItem('userName');
let ifAI = false;
// console.log(userName);
if (userName) {
    $('.userName').val(userName);
}

function login(type) {
    // localStorage.removeItem('token');
    if (type == 'ai') {
        username = $('#aiUserName').val();
        password = $('#aiUserPassword').val();
        ifAI = true;
    }
    else {
        username = $('#ledgerUserName').val();
        password = $('#ledgerUserPassword').val();
    }
    if ($("input:checked").val()) {
        localStorage.setItem('userName', username)
    }
    let data = {
        userName: username,
        password: password
    }
    // console.log('user', data);
    let dataStr = JSON.stringify(data);
    // data.append('username', username);
    // data.append('password', password);
    $.ajax({
        type: "POST",
        url: url,
        data: dataStr,
        contentType: "application/json",
        // dataType: 'json',
        success: function (data) {
            // console.log('data', data);
            if (data && data['access_token']) {
                window.localStorage.setItem('token', data['access_token']);
                $('#loginError').addClass('hide');
                if (ifAI) {
                    location.href = "dashboard/#/profile";
                }
                else {
                    location.href = "dashboard/#/ledger/index";
                }
            }

            // console.log(data);
        },
        error: function (a, b, c) {
            // debugger
            $('#loginError').removeClass('hide');
            console.log(a, b, c);

        },
        processData: false,
        // contentType: false,
    });
}





/* translation */

let saveLang;
saveLang = localStorage.getItem('lang');


//////////////////////////////////translation



let translations;

// console.log('saveLang', saveLang);
let currentLang = saveLang ? saveLang : "en";
$.getJSON("_include/js/translation.json", function (data) {
    translations = data;

    if (currentLang != 'en') {
        setContent(currentLang);
    }

});
// console.log('currentLang', currentLang);

function setContent(lang = "en") {
    //  console.log('lang', lang);
    // make language setting choice item color
    // console.log('lang', lang);
    $(document).ready(function () {
        $(".langen").click(function () {
            $(".langen").css("color", "#8db9ff");
            $(".langch").css("color", "#FFF");
            // console.log('langen', lang);
        });
        $(".langch").click(function () {
            $(".langen").css("color", "#FFF");
            $(".langch").css("color", "#8db9ff");
        });
    });
    // $('document').ready(function () {
    // console.log('lang', localStorage.getItem('lang'));
    if (lang == 'en') {
        $(".lang-en").css('display', 'block');
        $(".lang-ch").css('display', 'none');
    }
    if (lang == 'ch') {
        $(".lang-ch").css('display', 'block');
        $(".lang-en").css('display', 'none');
    }
    // });
    // console.log('href', lang, url, window.location.href);
    currentLang = lang;
    localStorage.setItem('lang', lang);
    // for (var x = 0; keys = Object.keys(translations[lang]), x < keys.length; x++) {
    //     $(".translate-" + keys[x].toDash())
    //         .text("")
    //         .append(translations[lang][keys[x]]);
    // }
}
function reloadPage() { }
//get input value by "enter"
// $(function() {
//     var event = arguments.callee.caller.arguments[0] || window.event;
$("#workerdid").keydown(function (event) {
    if (event.keyCode == 13) {
        openWorkerinfo();
    }
});
// });

//open new window for workerinfo
function openWorkerinfo(e) {
    // window.location.href = https://nbai.io/dashboard/#/worker/workerinfo?did=0xa9800411E4175b52d6792e7FA983F675F6ef39E0
    let tem = $("#workerdid").val();
    // window.location.href = "https://nbai.io/dashboard/#/worker/workerinfo?did=" + tem;
    window.open("https://nbai.io/dashboard/#/worker/workerinfo?did=" + tem);
}





String.prototype.toDash = function () {
    // console.log('toDash', this.replace(/([A-Z])/g, function ($1) { return "-" + $1.toLowerCase(); }))
    return this.replace(/([A-Z])/g, function ($1) { return "-" + $1.toLowerCase(); });
}


