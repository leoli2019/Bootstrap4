$(document).ready(function () {
    $.ajax({
        type: 'GET',
        // url: 'http://192.168.88.119:8080/orionboot/contact_type',
        url: conTypeUrl,
        data: {},
        success: function (res) {
            if (res) {
                // console.log('lists', res);
                let list = res['data'];
                if (list.length > 0) {
                    list.forEach(element => {
                        list.name = element.subject;
                        list.id = element.id;
                        // console.log('listt',list.name, list.id, element.disable);
                            $('#inquiry').append(
                                '<option value=' + list.id + '>' + list.name + '</option>'
                        );
                    });
                }
            }
        },
        error: function (err) {
            console.log('err', err);
        }
    });

    $('#firstName').on('input propertychange', function () {
        var count1 = $(this).val().length;
        //  console.log('count', count1);
        if (count1 === 0) {
            $("#warname1").css({ display: 'block' });
        } else {
            $("#warname1").css({ display: 'none' });
        }
    });
    $('#lastName').on('input propertychange', function () {
        var count2 = $(this).val().length;
        //  console.log('count', count2);
        if (count2 === 0) {
            $("#warname2").css({ display: 'block' });
        } else {
            $("#warname2").css({ display: 'none' });
        }
    });
    $('#email').on('input propertychange', function () {
        var count3 = $(this).val().length;
        //  console.log('count', count3);
        if (count3 === 0) {
            $("#waremail").css({ display: 'block' });
        } else {
            $("#waremail").css({ display: 'none' });
        }
    });
    $('#comment').on('input propertychange', function () {
        var count4 = $(this).val().length;
        //  console.log('count', count4);
        if (count4 === 0) {
            $("#warcomment").css({ display: 'block' });
        } else {
            $("#warcomment").css({ display: 'none' });
        }
    });
    $('#inquiry').on('input propertychange', function () {
        var count5 = $(this).val().length;
        //  console.log('count', count5);
        if (count5 <= 0) {
            $("#warinquiry").css({ display: 'block' });
        } else {
            $("#warinquiry").css({ display: 'none' });
        }
    });
    $('#country').on('input propertychange', function () {
        var count6 = $(this).val().length;
        //  console.log('count', count6);
        if (count6 === 0) {
            $("#warcountry").css({ display: 'block' });
        } else {
            $("#warcountry").css({ display: 'none' });
        }
    });
});


function submitForm() {
    firstName = $('#firstName').val();
    lastName = $('#lastName').val();
    email = $('#email').val();
    comment = $('#comment').val();
    title = $('#title').val();
    inquiry = Number($('#inquiry').val());
    country = $('#country').val();
    phone = $('#phone').val();
    company = $('#company').val();

    let data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        comment: comment,
        title: title,
        inquiry: inquiry,
        country: country,
        phone: phone,
        company_name: company,
        source: 'cloud.nbai.io'
    }
    // console.log('country', country);
    obj = JSON.stringify(data);
    // console.log('obj', obj);

    if (firstName == "") {
        $("#warname1").css({ display: 'block' });
    } else {
        $("#warname1").css({ display: 'none' });
    }
    if (lastName == "") {
        $("#warname2").css({ display: 'block' });
    } else {
        $("#warname2").css({ display: 'none' });
    }
    if (email == "") {
        $("#waremail").css({ display: 'block' });
    } else {
        $("#waremail").css({ display: 'none' });
    }
    if (inquiry <= 0) {
        $("#warinquiry").css({ display: 'block' });
    } else {
        $("#warinquiry").css({ display: 'none' });
    }
    if (country == null) {
        $("#warcountry").css({ display: 'block' });
    } else {
        $("#warcountry").css({ display: 'none' });
    }
    if (!comment) {
        $("#warcomment").css({ display: 'block' });
    } else {
        $("#warcomment").css({ display: 'none' });
    }


    if (firstName !== "" && lastName !== "" && email !== "" && comment !== "" && country !== null && inquiry > 0) {
        $.ajax({
            method: 'POST',
            data: obj,
            dataType: 'json',
            // url: apiUrl + '/customers/contactInfo',
            url: contactUrl,
            headers: {
                "Content-Type": "application/json"
            },
            success: function (data) {
                // console.log('data', data);
                $("body").append("<div id='mask'></div>");
                $("#mask").addClass("mask").fadeIn("slow");
                $("#successBox").fadeIn("slow");
                $(".close_btn").hover(function () { $(this).css({ color: 'black' }) },
                    function () { $(this).css({ color: '#999' }) }).on('click', function () {
                        $("#successBox").fadeOut("fast");
                        $("#mask").css({ display: 'none' });
                        document.form.reset();
                    });
                $("#btn1").click(function () {
                    $("#successBox").fadeOut("fast");
                    $("#mask").css({ display: 'none' });
                    document.form.reset();
                });
            },
            error: function (err) {
                console.log('error', err);
            }
        });
    }
}
