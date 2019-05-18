const jwt = localStorage.getItem('jwt');

$("#map-drawer-expansion-button").on("click", () => {
    $("#map-drawer").toggleClass("map-side-expanded");
    $("#map-drawer-details-wrapper").slideToggle(350);
    $("#map-drawer-expansion-button").toggleClass("fa-chevron-up fa-chevron-down");
});

$("#map-drawer-close-button").on("click", () => {
    $("#map-drawer").hide();
});

// Generates popup for booking
$('#map-drawer').on("click", '#request-booking-button', () => {
    createPopup();
    setPopupBookingPageOne();
    $("#popup").fadeIn(200);
    checkSelected();
});

// Checks if any time has been selected. Disables confirm button if none are selected.
function checkSelected() {
    var selected = document.getElementsByClassName('button-selected');
    if (selected[0] === undefined) {
        $('#popup-confirm').prop('disabled', true);
        $('#popup-confirm').addClass('disabled-button');
        $('#popup-confirm').html('Please select a time slot!');
    } else {
        $('#popup-confirm').removeClass('disabled-button');
        $('#popup-confirm').prop('disabled', false);
        $('#popup-confirm').html('Request Booking');
    }
}


// Removes popup for booking
$(document).on("click", "#popup-cancel, #popup-finish", (e) => {
    if (e.target.id == "popup-cancel" || e.target.id == "popup-finish") {
        $("#popup-wrapper").remove();
    }
});

$(document).on("click", "#popup-confirm", (e) => {
    var date = $("#datepicker").val();;
    var time = $("#popup-time").html();
    console.log(time);
    popupPageOne = $("#popup").children().not("#popup-close-button").detach();
    setPopupBookingPageTwo(date, time);

});
$(document).on("click", "#popup-back", (e) => {
    $("#popup").children().not("#popup-close-button").remove();
    $("#popup").prepend(popupPageOne);
    e.stopPropagation();
});

$(document).on("click", "#popup-confirm-validate", (e) => {
    var date = $("#popup-date").html();
    var time = $("#popup-time").html();
    $("#popup").children().not("#popup-close-button").remove();
    setPopupBookingPageThree(date, time);
});


// Adds a new time slot button
var addTimeSlot = (startTime, endTime) => {
    var timeSlot = document.createElement('button');
    timeSlot.className = "time-slot-button";
    timeSlot.innerHTML = startTime + " - " + endTime;
    $("#popup-time-slots").append(timeSlot);
}



var setPopupBookingPageOne = () => {
    createPopupHeader("h3", "Book a Time", "booking-header");
    createPopupSubheader("div", "<b id='popup-date'><input type='text' readonly class='form-input' id='datepicker' value='" + getCurrentDate() + "'></b>", "booking-datepicker");
    $("#datepicker").datepicker({ dateFormat: "yy-mm-dd"});
    createPopupContent("popup", "div", "popup-time-slots", "full-center-wrapper");

    createPopupConfirmButton("popup-confirm", "Request Booking");
    createPopupCancelButton("popup-cancel", "Cancel");
}
var setPopupBookingPageTwo = (date, time) => {
    createPopupSubheader("h5", "You have requested: <b id='popup-date'>" + date + "</b> at <b id='popup-time'>" + time + "</b>. Do you wish to confirm this booking request?", "booking-confirmation-text");
    createPopupConfirmButton("popup-confirm-validate", "Confirm");
    createPopupCancelButton("popup-back", "Back");
}

var setPopupBookingPageThree = (date, time) => {
    createPopupSubheader("h5", "Your booking for <b id='popup-date'>" + date + "</b> at <b id='popup-time'>" + time + "</b> has been sent. Please wait for a confirmation from the host before making your payment.", "booking-finish-text");
    createPopupCancelButton("popup-finish", "Close");
}

// Colour change for time slot button
$(document).on("click", ".time-slot-button", (e) => {
    e.preventDefault();
    $(".time-slot-button").removeClass("button-selected");
    $(".time-slot-button").removeAttr("id");
    $(e.target).addClass("button-selected");
    $(e.target).attr("id", "popup-time");
    checkSelected();
    e.stopPropagation();
});

// Renders charger information onto drawer
$('body').on("click", ".marker", async (e) => {
    console.log(e.target.id);
    e.preventDefault();
    try {
        const url = '/charger/query?charger_id=' + e.target.id;
        console.log(url);
        const response = await fetch(url);
        const json = await response.json();
        const data = json['0'];
        const chargername = data['chargername']
        const city = data['city']
        const cost = data['cost']
        const details = data['details']
        const level = data['level']
        const type = data['type']
        const rating = data['rating']
        console.log(data);
        $("#map-drawer").show();
        populateChargerInfo(e.target.id, chargername, city, cost, details, level, type, rating);
    } catch (error) {
        console.log("Error: ", error)
    }
});


const populateChargerInfo = (chargerid, chargername, city, cost, details, level, type, rating) => {
    //console.log(chargername, city, cost, details, level, type, rating);
    $('#map-drawer-text-wrapper').children().remove();
    $('#map-drawer-text-wrapper').append('<div class="map-drawer-text-row" id="map-drawer-charger-name">' + chargername + '</div>')
    $('#map-drawer-text-wrapper').append('<div class="map-drawer-text-row"><div class="map-drawer-text-left">City</div><div class="map-drawer-text-right">' + city + '</div></div><br>')
    $('#map-drawer-text-wrapper').append('<div class="map-drawer-text-row"><div class="map-drawer-text-left">Level</div><div class="map-drawer-text-right">' + level + '</div></div><br>')
    $('#map-drawer-text-wrapper').append('<div class="map-drawer-text-row"><div class="map-drawer-text-left">Type</div><div class="map-drawer-text-right">' + type + '</div></div><br>')
    $('#map-drawer-text-wrapper').append('<div class="map-drawer-text-row"><div class="map-drawer-text-left">Hourly Rate</div><div class="map-drawer-text-right">$' + cost + '</div></div><br>')
    $('#map-drawer-text-wrapper').append('<div class="map-drawer-text-row"><div class="map-drawer-text-left">' + (rating !== undefined ? rating : "No Rating") + '</div><div class="map-drawer-text-right orange-highlight" id="map-drawer-see-reviews">See Reviews</div></div><br>')
    $('#map-drawer-text-wrapper').append('<div class="map-drawer-text-row" id="map-drawer-details-wrapper"><div class="map-drawer-text-left">Additional Details</div><br><div class="map-drawer-text-left" id="map-drawer-details">' + (details !== '' ? details : "<i>None</i>")  + '</div></div>');
    if (jwt) {
        $('#map-drawer-text-wrapper').append('<button id="request-booking-button" class="orange-button">REQUEST BOOKING</button>')
    }
    $('#request-booking-button').click((e) => {
        // When changing days, display new time slots
        $('body').on('change', '#datepicker', async (evt) => {
            console.log($('#' + evt.target.id).val());
            evt.preventDefault();
            try {
                let date = $('#' + evt.target.id).val();
                console.log(date);
                const url = '/charger/schedule?cUID=' + chargerid + "&date=" + date;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt
                    }
                })
                console.log(response);
                const json = await response.json();
                let arr = ['00:00:00', '01:00:00', '02:00:00', '03:00:00', '04:00:00', '05:00:00',
                           '06:00:00', '07:00:00', '08:00:00', '09:00:00', '10:00:00', '11:00:00', 
                           '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00',
                           '18:00:00', '19:00:00', '20:00:00', '21:00:00', '22:00:00', '23:00:00'];
                console.log(arr);
                json.forEach((item) => {
                    currItemStartTimeIndex = item.startTime.split("T")[1].split(":00:00.000Z")[0];
                    delete arr[parseInt(currItemStartTimeIndex, 10)];
                })
                $("#popup-time-slots").children().remove();
                arr.forEach((startTime) => {
                    addTimeSlot( (parseInt(startTime.substring(0, 2))) + startTime.substring(2),
                                 (parseInt(startTime.substring(0, 2)) + 1) + startTime.substring(2));
                })
            } catch (error) {
                console.log("Error: ", error)
            }
        });
        
        // Sends POST request to add a new booking
        $('body').on("click", "#popup-confirm-validate", async (evt) => {
            const date = $('#popup-date').html();
            var startTime = $('#popup-time').html().split(' - ')[0];
            var endTime = $('#popup-time').html().split(' - ')[1];
            const url = 'booking/newBooking'
            console.log(url);
            const data = {
                charger: chargerid,
                timeStart: date + " " + startTime,
                timeEnd: date + " " + endTime
            }
            console.log(data);
            try {
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwt
                    }
                }).then(response => 
                console.log(response));
            } catch (error) {
                console.log("Error: ", error)
            }
        });
    });
}
