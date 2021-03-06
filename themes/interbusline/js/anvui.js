$(document).ready(function(){
	var ticketPrice = 0, can_chon_ghe = !0, startPoint = "", endPoint = "", date = "", lang = 1;

    const vn = {
        login: "Đăng nhập",
        search: "Tìm kiếm",
        lineTitle: "CÁC TUYẾN XE HIỆN CÓ",
        time: "THỜI GIAN",
        line: "TUYẾN ĐƯỜNG",
        startTo: "Xuất phát từ",
        from: "đến",
        datghe: "CHỌN GHẾ",
        cabinTitle: "Hình ảnh cabin",
        chuthich_dachon: "Ghế đã đặt",
        chuthich_chuachon: "Ghế chưa chọn",
        chuthich_banchon: "Ghế bạn chọn",
        tang1: "Tầng 1",
        tang2: "Tầng 2",
        vphn: "VP Hà Nội",
        driver: "Tài",
        door: "Cửa",
        assistant: "Phụ",
        customer_info: "Thông tin khách hàng",
        fullName: "Tên của bạn",
        phoneNumber: "Số điện thoại",
        numberMan: "Người lớn",
        numberBayby: "Trẻ em",
        paymentTitle: "Phương thức thanh toán",
        addhn: "110 Trần Nhật Duật Strest, Hoàn Kiếm District, Hà Nội, Việt Nam",
        vpsp: "VP Sapa",
        addsp: "Số 147 đường Thạch Sơn , thị trấn Sapa , Lào Cai",
        otherTour: "TOUR KHÁC",
        dattour: "Đặt Tour Theo Yêu Cầu",
        thuexe: "Thuê Xe",
        vemaybay: "Vé Máy Bay",
        visa: "Dịch Vụ Visa-Hộ Chiếu",
        datphong: "Đặt Phòng Khách Sạn",
        news: "Tin Tức & Sự Kiện",
        about: "Về Chúng Tôi",
        faq: "Câu Hỏi Thường Gặp",
        policy: "Chính Sách Bảo Mật",
        term: "Điều Khoản Sử Dụng",
    };

    const en = {
        login: "Login",
        search: "Search",
        lineTitle: "ALL ROUTE",
        time: "TIME",
        line: "LINE",
        startTo: "Start to",
        from: "from",
        datghe: "SELECT YOUR SEAT",
        cabinTitle: "Cabin Images",
        chuthich_dachon: "Unavailable",
        chuthich_chuachon: "Available",
        chuthich_banchon: "Selected",
        tang1: "Floor 1",
        tang2: "Floor 2",
        driver: "Driver",
        door: "Door",
        assistant: "Assistant",
        customer_info: "Customer Info",
        fullName: "Your Name",
        phoneNumber: "Phone",
        numberMan: "Adult",
        numberBayby: "Children",
        paymentTitle: "Payment Type",
        vphn: "Hanoi Office",
        addhn: "110 Tran Nhat Duat Street, Hoan Kiem District, Hanoi, Vietnam",
        vpsp: "Sapa Office",
        addsp: "No. 147 Thach Son Str. , Sapa Town , Lao Cai",
        otherTour: "OTHER TOURS",
        dattour: "Booking Request",
        thuexe: "Car Rental",
        vemaybay: "Air Ticket",
        visa: "Visa Services",
        datphong: "Hotel Accommodation",
        news: "News & Event",
        about: "About Us",
        faq: "FAQs",
        policy: "Privacy Policy",
        term: "Term & Condition",
    };
    

    $("#vn").click(function () {
        lang = 1;
        changeLang(lang);
    });

    $("#en").click(function () {
        lang = 2;
        changeLang(lang);
    });


	var chuyenav = getParameterByName('chuyenav');
    startPoint = getParameterByName('startPoint');
    endPoint = getParameterByName('endPoint');
    date = getParameterByName('date');
	
	if(chuyenav !== '' && chuyenav !== null  && startPoint !== '' && startPoint !== null && endPoint !== '' && endPoint !== null && date !== '' && date !== null)
    {
        setPoint(chuyenav);
        setTimeout(function(){
            $("#startPoint").val(startPoint);
            $("#startPoint").change();
            $("#endPoint").val(endPoint);
            $("#endPoint").change();
            getChuyenDi(startPoint, endPoint, date, chuyenav);
        }, 1000);
    }
	
	
    $(".listchuyen").hide();
    $('#phoneNumber').on("keypress", function(evt) {
        var keycode = evt.charCode || evt.keyCode;

        switch (keycode) {
            case 43:
            case 44:
            case 45:
            case 46:
                return false;
            default:
                return true;
        }
    });

    var currentDate = new Date();
    $('.datepicker').datepicker({
        format: "dd-mm-yyyy",
        autoclose: true,
    }).datepicker("setDate", "0");


    $('#numberBayby').on("keypress", function(evt) {
        var keycode = evt.charCode || evt.keyCode;

        switch (keycode) {
            case 43:
            case 44:
            case 45:
            case 46:
                return false;
            default:
                return true;
        }
    });

    $.validator.addMethod('validatePhone', function (value, element) {
        var flag = false;
        var phone = element.value.trim();
        phone = phone.replace('(+84)', '0');
        phone = phone.replace('+84', '0');
        phone = phone.replace('0084', '0');
        phone = phone.replace(/ /g, '');
        if (phone != '') {
            var firstNumber = phone.substring(0, 2);
            if ((firstNumber == '09' || firstNumber == '08') && phone.length == 10) {
                if (phone.match(/^\d{10}/)) {
                    flag = true;
                }
            } else if (firstNumber == '01' && phone.length == 11) {
                if (phone.match(/^\d{11}/)) {
                    flag = true;
                }
            }
        } else {
            flag = true;
        }

        return flag;
    }, "Vui lòng nhập đúng định dạng số điện thoại");

    $('#form').validate({
        errorClass: 'error_border',
        rules: {
            contacterPhoneNumber: "validatePhone",
            phoneNumber: "validatePhone"
        },
    });

var idAV = $("base").attr("id");

	$.ajax({
		type: "POST", url: "https://anvui.vn/chuyenAV", data: {idAV: idAV}, success: function (result) {
			var d = 0;
			$('#chuyenav').append('<div class="item text-center active" id="id'+d+'">');
			$("#loading").show(), $.each(result.chuyen, function (e, t) {

			    if(result.chuyen.length > 6)
                {
                    $(".carousel-control").show();
                }else {
                    $(".carousel-control").hide();
                }
				
				if(e >= d+6)
					{
						d +=6;
						if(d>=result.chuyen.length)
						{
							d = result.chuyen.length - 1;
						}
						$('#chuyenav').append('<div class="item text-center" id="id'+d+'">');
						$("#id"+d).append('<button type="button" class="d-inline cus-btn" value="' + t.routeId + '">' + t.routeName + '</button>');
						$("#id"+d).append('<button type="button" class="d-inline cus-btn" value="' + t.routeId + '">' + t.routeName + '</button>');
					}
				else{
					$("#id"+d).append('<button type="button" class="d-inline cus-btn" value="' + t.routeId + '">' + t.routeName + '</button>');
					
				}

			}), $(".cus-select").selectpicker("refresh");
			var t = result.chuyen[0].routeId;
			$("#routeId").val(t);
			$("#chuyenavInput").val(t);
			$(".cus-btn").click(function () {
				var t = $(this).val();
				$("#routeId").val(t);
				setPoint(t);
			});

			setPoint(t), $("#loading").hide();
		}
	});
	
	$("#chuyendoi").click(function () {
        var temp = $("#startPoint").val();
        $("#startPoint").val($("#endPoint").val());
        $("#startPoint").change();
        $("#endPoint").val(temp);
        $("#endPoint").change();
        return false;
    });
	
	$("#TimChuyen").click(function () {
        var e = $("#startPoint").val(), t = $("#endPoint").val(), n = $("#datetimepicker").val(),
            a = $("#routeId").val();
        $(".datghe").hide();
        ("" == t || "" == e) && alert("Hãy chọn điểm đi và điểm đến"), getChuyenDi(e, t, n, a)
    });


    function setPoint(e) {
        $.ajax({
            type: "POST", url: "https://anvui.vn/pointNX", data: {routeId: e}, success: function (e) {
                $("#startPoint").html(""), $("#endPoint").html(""), $.each(e.a1, function (e, t) {
                    var n = '<option value="' + t.pointId + '">' + t.pointName + "</option>";
                    $("#startPoint").append(n)
                }), $("#startPoint").selectpicker("refresh"), $.each(e.a2, function (e, t) {
                    var n = '<option value="' + t.pointId + '">' + t.pointName + "</option>";
                    $("#endPoint").append(n)
                }), $("#endPoint").selectpicker("refresh")
            }
        })
    }

    function getChuyenDi(e, t, n, a) {
        $.ajax({
            type: "POST",
            url: "https://anvui.vn/listSchedule",
            data: {startPoint: e, endPoint: t, timeStart: n, routeId: a},
            success: function (e) {
                $("#loading").show(), $(".listchuyen").html(""), console.log(e), $(".listchuyen").show();
                // $("#form").hide();
                var t = !0;
                $.each(e, function (e, n) {

                    var a = '<div id="chon_chuyen_' + e + '" onclick="javascript: chon_chuyen(' + e + ');" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 thumbnail" data-id="' + n.tripId + '" data-scheduleId="' + n.scheduleId + '" data-getInPointId="' + n.getInPointId + '" data-getOffPointId="' + n.getOffPointId + '" data-getInTime="' + n.getInTime + '" data-ticketPrice="' + n.ticketPrice + '" data-companyStatus="' + n.companyStatus + '" data-startDate="' + n.startDate + '">' +
                        '<div class="row"><div class="col-lg-2 col-md-2 col-sm-2 col-xs-9"><img class="img-responsive logo-chuyen" width="100px" height="100px" alt="AN VUI" src="https://anvui.vn/themes/icon/iConAnVuiVang.png"></div>' +
                        '<div class="col-lg-9 col-md-9 col-sm-12 col-xs-9">' +
                        '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 thongtin"><div class="service-name"> ' + n.companyName + ' </div><div class="service-type">' + n.routeName + '</div></div>' +
                        '<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 thongtin"><div class="service-name time">  </div><div class="service-type">' + n.startTime + '</div></div>' +
                        '<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 thongtin"><div class="service-name line">  </div><div class="service-type"><span class="startTo"></span> ' + n.getInPointName + ' - <span class="from"></span> ' + n.getOffPointAddress + '</div></div>' +
                        '<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 thongtin text-right"><div class="price-vn"> <span style="color: #FF0000">' + n.ticketPrice1 + '</span> VND </div></div>' +
                        '</div>' + // row 9
                        '</div>'+ //row
                        '</div>';
                    $("#emptymes").hide();
                    $(".listchuyen").append(a), $("#bus-line").show(), $("#chonghe").hide(), $("#thongtin").hide(), t = !1
                }), $("#beginmes").hide(), t && ($("#chonghe").hide(), $("#thongtin").hide(), $("#emptymes").show()), $("#loading").hide(), changeLang(lang);
            }
        })
    }




    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }


    function changeLang(lang) {
        var a = '';
        if(lang == 1){
            a = vn;
        } else {
            a = en;
        }
        $(".cus-login").html(a.login);
        $("#TimChuyen").html(a.search);
        $(".line-title").html(a.lineTitle);
        $(".time").html(a.time);
        $(".line").html(a.line);
        $(".startTo").html(a.startTo);
        $(".from").html(a.from);
        $("#datghe").html(a.datghe);
        $("#cabin-title").html(a.cabinTitle);
        $(".chuthich_dachon").html(a.chuthich_dachon);
        $(".chuthich_chuachon").html(a.chuthich_chuachon);
        $(".chuthich_banchon").html(a.chuthich_banchon);
        $(".tang1").html(a.tang1);
        $(".tang2").html(a.tang2);
        $(".driver").html(a.driver);
        $(".door").html(a.door);
        $(".assistant").html(a.assistant);
        $(".customer-info").html(a.customer_info);
        $(".fullName").html(a.fullName);
        $(".phoneNumber").html(a.phoneNumber);
        $(".numberMan").html(a.numberMan);
        $(".numberBayby").html(a.numberBayby);
        $(".payment-title").html(a.paymentTitle);
        $(".vphn").html(a.vphn);
        $(".vpsp").html(a.vpsp);
        $("#addhn").html(a.addhn);
        $("#addsp").html(a.addsp);
        $("#other-tour").html(a.otherTour);
        $("#dattour").html(a.dattour);
        $("#thuexe").html(a.thuexe);
        $("#vemaybay").html(a.vemaybay);
        $("#visa").html(a.visa);
        $("#datphong").html(a.datphong);
    }


});

function chon_chuyen(e) {
    var t = "#chon_chuyen_" + e;

    $(".thumbnail").removeClass("selected");

    $("#chon_chuyen_" + e).addClass("selected");


    if (ghedachon = [], tripId = $(t).attr("data-id"), scheduleId = $(t).attr("data-scheduleId"), getOffPointId = $(t).attr("data-getOffPointId"), getInPointId = $(t).attr("data-getInPointId"), getInTime = $(t).attr("data-getInTime"), ticketPrice = $(t).attr("data-ticketPrice"), companyStatus = $(t).attr("data-companyStatus"), startDate = $(t).attr("data-startDate"), 1 == companyStatus) return $("#goidien").show(), !1;
    console.log("https://anvui.vn/dat-ve-ssl?tripId=" + tripId + "&scheduleId=" + scheduleId);
    $(".chuyendi").removeClass("selected"), $(this).addClass("selected"), $(".box-chonghe").html("<center>Loading...</center>"), $("#chonghe").show(), $("#thongtin").show();
    console.log(tripId), console.log(scheduleId), $.getJSON("https://anvui.vn/dat-ve-ssl?tripId=" + tripId + "&scheduleId=" + scheduleId, function (e) {
        $("#loading").show();

        $('html, body').animate({
            scrollTop: $(".datghe").offset().top
        }, 1000);

        seatMap = e.seatMap.seatList;
        for (var t = "", n = 1; n < e.seatMap.numberOfFloors + 1; n++) {
            t += '<div class="col-md-6 tachtang"><div class="col-md-12 col-sm-12 col-xs-12 tang' + n + '">Tầng ' + n + "</div>";
            for (var a = 1; a < e.seatMap.numberOfRows + 1; a++) for (var i = 1; i < e.seatMap.numberOfColumns + 1; i++) coghe = !1, iddd = "", $.each(e.seatMap.seatList, function (d, o) {
                var h = o.seatId, c = h.replace(",", "_");
                iddd = n + " " + a + " " + i, o.floor != n || o.row != a || o.column != i || (coghe = !0, t += 2 == o.seatType ? '<div data-id="' + iddd + '" class="col-md-2 ghe_' + e.seatMap.numberOfColumns + '"><div class="chonghe chonghekodcchon driver" >Tài</div></div>' : 1 == o.seatType ? '<div data-id="' + iddd + '" class="col-md-2 ghe_' + e.seatMap.numberOfColumns + '"><div class="chonghe chonghekodcchon door" >Cửa</div></div>' : 5 == o.seatType ? '<div data-id="' + iddd + '" class="col-md-2 ghe_' + e.seatMap.numberOfColumns + '"><div class="chonghe chonghekodcchon" >WC</div></div>' : 6 == o.seatType ? '<div data-id="' + iddd + '" class="col-md-2 ghe_' + e.seatMap.numberOfColumns + '"><div class="chonghe chonghekodcchon assistant" >Phụ</div></div>' : 1 == o.seatStatus ? '<div data=id="' + iddd + '" class="col-md-1 ghe_' + e.seatMap.numberOfColumns + " gheloai_" + o.seatType + '"><div class="chonghe" id="chonghe_' + c + '" onclick="chonghe(\'' + h + "')\">" + h + "</div></div>" : '<div data=id="' + iddd + '"  class="col-md-2 ghe_' + e.seatMap.numberOfColumns + " gheloai_" + o.seatType + '"><div class="chonghe chonghekodcchon" >' + h + "</div></div>")
            }), coghe || (t += '<div data=id="' + iddd + '"  class="col-md-2 ghe_' + e.seatMap.numberOfColumns + ' kocoghe"> </div>');
            t += "</div>"
        }
        $(".box-chonghe").html(t), $("#loading").hide(), $(".datghe").show();
    })
}

function checknumbaby(e) {
    return e > ghedachon.length ? ($("#numberBayby").val(ghedachon.length), alert("Số trẻ em phải nhỏ hơn số ghế!"), !0) : !0
}

Number.prototype.format = function (e, t) {
    var n = "\\d(?=(\\d{" + (t || 3) + "})+" + (e > 0 ? "\\." : "$") + ")";
    return this.toFixed(Math.max(0, ~~e)).replace(new RegExp(n, "g"), "$&,")
};

var seatMap;



function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].seatId === nameKey) {
            return myArray[i];
        }
    }
}

function hoanthanh() {
    if (0 == ghedachon.length) return alert("Hãy chọn ghế!"), !1;
    if (ghedachon.length > 10) return alert("Chỉ được chọn dưới 10 ghế!"), !1;
    var e = $("input[name=paymenttype]:checked").val(), t = $("#fullName").val(), n = $("#phoneNumber").val();
    if ("" == t) return alert("Hãy nhập tên!"), $("#fullName").focus(), !1;
    if ("" == n) return alert("Hãy nhập số điện thoại!"), $("#phoneNumber").focus(), !1;

    var lenght_requied = 0;

    switch (n.substring(0, 2)) {
        case "01" :
            lenght_requied = 11;
            break;
        case "09" :
        case "08" :
            lenght_requied = 10;
            break;
        default :
            return alert("Không đúng định dạng điện thoại!"), $("#phoneNumber").focus(), !1;

    }


    if(n.indexOf(".") !== -1  || n.indexOf(",") !== -1) return alert("Không đúng định dạng điện thoại!"), $("#phoneNumber").focus(), !1;

    if(n.length < lenght_requied || n.length > lenght_requied) return alert("Số điện thoại phải " + lenght_requied + " số"), $("#phoneNumber").focus(), !1;


    if ("" == tripId) return alert("Thiếu dữ liệu!"), !1;
    if ("" == getInPointId) return alert("Thiếu dữ liệu!"), !1;
    if ("" == getOffPointId) return alert("Thiếu dữ liệu!"), !1;
    if ("" == scheduleId) return alert("Thiếu dữ liệu!"), !1;
    if ("" == getInTime) return alert("Thiếu dữ liệu!"), !1;
    if (0 == ticketPrice) return alert("Thiếu dữ liệu!"), !1;
    var a = $("#numberBayby").val(), i = ghedachon.length, d = ticketPrice * i;
    $("#hoanthanhbtn").hide(), $("#loadingbtn").show(), $.ajax({
        type: "POST",
        url: "https://anvui.vn/order-ssl",
        data: {
            listSeatId: JSON.stringify(ghedachon),
            fullName: t,
            phoneNumber: n,
            getInPointId: getInPointId,
            startDate: startDate,
            getOffPointId: getOffPointId,
            scheduleId: scheduleId,
            getInTimePlan: getInTime,
            originalTicketPrice: d,
            paymentTicketPrice: d,
            paymentType: e,
            paidMoney: 0,
            tripId: tripId,
            numberOfAdults: i,
            numberOfChildren: a
        },
        success: function (t) {
            if ($("#loading").show(), console.log(t), 200 != t.code) alert("Đã có lỗi xảy ra, hãy đặt lại!"), $("#hoanthanhbtn").show(), $("#loadingbtn").hide(); else if (1 == e) {
                var a = "https://dobody-anvui.appspot.com/payment/dopay?vpc_OrderInfo=" + t.results.ticketId + "&vpc_Amount=" + 100 * d + "&phoneNumber=" + n + "&packageName=web";
                window.location.href = a
            } else $("#datthanhcong").show(), $("#hoanthanhbtn").hide(), $("#loadingbtn").hide(), $("#gohomebtn").show();
            $("#loading").hide()
        }
    })
}

function chonghe(e) {
    var t = e.replace(",", "_"), n = ghedachon.indexOf(e);

    seat = search(e, seatMap);

    if(seat.images[0] == '')
    {
        $("#img1").attr("src", "image/bg-login.jpg");
    } else {
        $("#img1").attr("src", seat.images[0]);
    }

    if(seat.images[1] == '')
    {
        $("#img2").attr("src", "image/bg-login.jpg");
    } else {
        $("#img2").attr("src", seat.images[1]);
    }

    if(seat.images[2] == '')
    {
        $("#img3").attr("src", "image/bg-login.jpg");
    } else {
        $("#img3").attr("src", seat.images[2]);
    }

    if (n > -1) $("#chonghe_" + t).removeClass("chonghechon"), ghedachon.splice(n, 1); else {
        if (ghedachon.length > 10) return alert("Chỉ được chọn dưới 10 ghế!"), !1;
        $("#chonghe_" + t).addClass("chonghechon"), ghedachon.push(e)
    }
    xacnhan();
}

function xacnhan() {
    if (console.log(ghedachon), 0 == ghedachon.length) return alert("Hãy chọn ghế!"), !1;
    if (ghedachon.length > 10) return alert("Chỉ được chọn dưới 10 ghế!"), !1;
    var e = "";
    $.each(ghedachon, function (t, n) {
        e += n + ","
    }), $("#ghedachonspan").html(e), $(".xacnhanbtn").hide(), $("#thongtin").show();
    var t = $("#numberBayby").val(), n = ghedachon.length - t;
    0 > n && (n = 0, $("#numberBayby").val(ghedachon.length)), $("#numberMan").val(n);
    var a = ghedachon.length * ticketPrice;
    /*console.log(n),*/ $("#priceneedpay").text(a.format());
}



