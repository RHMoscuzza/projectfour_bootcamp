const nasaApp = {};

nasaApp.events = function() {
	$(".submittedDate").click(function(){
    	var userDate = $(".dateSelected").val();
    	console.log(userDate)
    nasaApp.asteroidDangerDetector(userDate);
	});
	// SMOOTH SCROLL (code courtesy of https://paulund.co.uk/smooth-scroll-to-internal-links-with-jquery)
	$('a[href^="#"]').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
	});
}

nasaApp.asteroidDangerDetector = function(dateSelected){
	var apiKey = `QzvDPkZrhNMDItpTd7CzQqEFUmy3e4pRXZfRfHqk`;
	var userDate = dateSelected;
    var asteroidData = $.ajax({
        url: `https://api.nasa.gov/neo/rest/v1/feed`,
        method: "GET",
        dataType: "json",
        data: {
        	api_key: apiKey,
        	start_date: userDate,
        	end_date: userDate
        }
    }).then(function(asteroidDataResponse){
    	console.log(asteroidDataResponse);
    	var asteroids = asteroidDataResponse.near_earth_objects[dateSelected];
    	nasaApp.hazardousDetector(asteroids);
	});
    var pictureOfTheDay = $.ajax({
    	url: `https://api.nasa.gov/planetary/apod`,
    	method: "GET",
    	dataType: "json",
    	data: {
    		api_key: apiKey,
    		date: userDate
    	}
    }).then(function(pictureDayResponse){
    	var imgReplacement = pictureDayResponse.url;
    	console.log(imgReplacement);
    	console.log(pictureDayResponse)
    	nasaApp.heroImgReplacement(imgReplacement)
    }).fail(function(error) {
    	var noImg = "images/galaxy.jpg";
    	if (error.statusText === "BAD REQUEST") {
    		nasaApp.heroImgReplacement(noImg);
    	}
    }); 
}

nasaApp.hazardousDetector = function(asteroids){
	console.log(asteroids)
	var danger = false;
	// var /noDanger;
	asteroids.forEach(function(data){
		if (data.is_potentially_hazardous_asteroid === true){
			danger = true;
		};
	});
	console.log(danger)
	nasaApp.displayWarning(danger)
};

nasaApp.displayWarning = function(dangerStat){
	var displayText = "";
	if (dangerStat === true) {
		displayText = "We have detected potentially hazardous asteroids! Stay Alert, Stay Safe!";
	} else {
		displayText = "No hazardous asteroids in sight! Have a wonderful day!";
	}
	$(".asteroidWarningContainer").empty();
	var asteroidWarning = $("<h2>").text(displayText);
	var asteroidContainer = $("<div>").addClass("asteroid").append(asteroidWarning);
	$(".asteroidWarningContainer").append(asteroidContainer);
}

nasaApp.heroImgReplacement = function(imgReplacement){
	var noImg = "images/galaxy.jpg";
	var imgFinal = imgReplacement.search(/\.jpg|\.jpeg|\.png|\.gif/);
	if (imgFinal == -1){
		$(".heroImg").attr("src", noImg);
	} else {
		$(".heroImg").attr("src", imgReplacement)
	}
};

nasaApp.init = function() {
	// nasaApp.asteroidDangerDetector();
	nasaApp.events();
}

$(function(){
	nasaApp.init();
});

// var hdf = hazardousDetector;
// var sentence = sentenceBuilder;
// var asteroid = asteroidList;
// var hdvo = hazardousDetectionVariableObject;
// var imgReplace = heroImgReplacement;
// is_potentially_hazardous_asteroid
