console.log("js file loaded successfullly");
//booking tab click; build elements for booking details
$("#bookings").click(function(event) {
	$("#bookings").css({"color" : "#F05A29"});
	$("#payment").css({"color" : "black"});
	$("#reviews").css({"color" : "black"});

	$("#subContent").html("");

	//container hold all confirmed bookings for user
	var confirmContainer = $("<div class='col-12'></div>");
	var bookingHeading1 = $("<h3 class='col-10 content-margin h1-font-size' id='bookingHeading1'><b>Confirmed Bookings</b></h3>");
	var bookingSubHeading1 = $("<h6 class='col-10 content-margin h2-font-size' id='bookingSubHeading1'> "
		+ "These bookings have been confirmed by the host and are ready to go!</h6>");
	// var confirmedBookingData = $("<div class='col-10 well' id='confirmedBookingData'>"
	// 	+ "Some info from firebase</div>");

	//container hold all pending bookings for user
	var pendingContainer =$("<div class='col-12'></div>");
	var bookingHeading2 = $("<h3 class='col-10  content-margin h1-font-size' id= 'bookingHeading2'><b>Pending Bookings</b></h3>");
	var bookingSubHeading2 = $("<h6 class='col-10 content-margin h2-font-size' id='bookingSubHeading2'>"
		+"These bookings have not been confirmed by the host yet, we’ll notify you when they do!</h6>");
	var pendingBookingData = $("<div class='col-10 well' id='pendingBookingData'>Some info from firebase</div>");

	//appending
	confirmContainer.append(bookingHeading1);
	confirmContainer.append(bookingSubHeading1);
	confirmContainer.append(confirmedBookingData);
	pendingContainer.append(bookingHeading2);
	pendingContainer.append(bookingSubHeading2);
	pendingContainer.append(pendingBookingData);

	$("#subContent").append(confirmContainer);
	$("#subContent").append(pendingContainer);

	var request = new Request('/client/bookings', {
		method: 'GET',
		body: {"uUID" : uUID, "bookingType" : "PENDING"}
	});
	
	fetch(request)
    .then((res)=> {return res.json()})
    .then((db) => {
		console.log(db);
        const data = JSON.stringify(db);
        let confirmedBookingData = $("<div class= 'col-10 well' id='confirmedBookingData>"
        +"<p id='cb-date'>" + data.date + "</p>"
        +"<p id='cb-cost'>" + data.cost + "</p>"
        +"<p id='cb-time'>" + data.startTime + "-" + data.endTime + "</p>"
        +"<p id='cb-address'>" + data.address + "</p>"
        +"<p id='cb-city'>" + data.city + "</p>"
		+"</div>");
		confirmContainer.append(confirmedBookingData);
    });

});
//payment tab click; build elements for payment details
$("#payment").click(function(event) {
	$("#bookings").css({"color" : "black"});
	$("#payment").css({"color" : "#F05A29"});
	$("#reviews").css({"color" : "black"});	
	
	$("#subContent").html("");

	//container hold all payment details for user
	var paymentContainer = $("<div class='col-12'></div>");
	var paymentHeading1 = $("<h3 class='col-10 content-margin h1-font-size' id='paymentHeading1'><b>Payment</b></h3>");
	var paymentSubHeading1 = $("<h6 class='col-10 content-margin h2-font-size' id='paymentSubHeading1'>" +
		"These bookings are unpaid for. Pay before the booking date!</h6>");
	var paymentData = $("<div class='col-10 well' id='paymentData'>Some info from firebase</div>");

	//appending
	paymentContainer.append(paymentHeading1);
	paymentContainer.append(paymentSubHeading1);
	paymentContainer.append(paymentData);

	$("#subContent").append(paymentContainer);

});

//reviews tab click; build elements for reviews details
$("#reviews").click(function(event) {
	$("#bookings").css({"color" : "black"});
	$("#payment").css({"color" : "black"});
	$("#reviews").css({"color" : "#F05A29"});	

	$("#subContent").html("");

	//container hold all review details for user
	var reviewContainer = $("<div class='col-12'></div>");
	var reviewHeading1 = $("<h3 class='col-10 content-margin h1-font-size' id='reviewHeading1'><b>Reviews for You</b></h3>");
	var reviewSubHeading1 = $("<h6 class='col-10 content-margin h2-font-size' id='reviewSubHeading1'>" +
		"These are the comments of hosts that you’ve charged with.</h6>");
	var reviewsData = $("<div class='col-10 well' id='reviewsData'>Some info from firebase</div>");
	
	//appending
	reviewContainer.append(reviewHeading1);
	reviewContainer.append(reviewSubHeading1);
	reviewContainer.append(reviewsData);

	$("#subContent").append(reviewContainer);

});
