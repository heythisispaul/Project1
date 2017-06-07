var count = 20;
var lastoffset = 0;
var currentOffset = 0;
var searchButton = false;

var createSearchButtons = function() {
	var topPrevBtn = $('<btn>').addClass('btn btn-primary last20')
							   .attr('id', 'toplast20')
							   .text('Display previous 20 results')
							   .hide();
	$('#buttondisplay').append(topPrevBtn);
	$("#toplast20").on('click', function(){
		event.preventDefault();
		
		// *** TESTING ***
		console.log("toplast20 clicked");

		if ((count * 2) > currentOffset) {
			currentOffset -= count;
		} else {
			currentOffset -= (count * 2);
		}
		
		lastoffset -= count;
		searchButton = false;
		search(count, currentOffset);
	});

	var topNextBtn = $('<btn>').addClass('btn btn-primary next20')
							   .attr('id', 'topnext20')
							   .text('Display next 20 results')
							   .hide();
	$('#buttondisplay').append(topNextBtn);
	$("#topnext20").on('click', function(){
		event.preventDefault();
		
		// *** TESTING ***
		console.log("topnext20 clicked");

		searchButton = false;
		search(count, currentOffset);
	});

	var btmPrevBtn = $('<btn>').addClass('btn btn-primary last20')
							   .attr('id', 'btmlast20')
							   .text('Display previous 20 results')
							   .hide();
	$('#bottombuttons').append(btmPrevBtn);
	$("#btmlast20").on('click', function(){
		event.preventDefault();
		
		// *** TESTING ***
		console.log("btmlast20 clicked");

		if ((count * 2) > currentOffset) {
			currentOffset -= count;
		} else {
			currentOffset -= (count * 2);
		}

		lastoffset -= count;
		searchButton = false;
		search(count, currentOffset);
	});

	var btmNextBtn = $('<btn>').addClass('btn btn-primary next20')
							   .attr('id', 'btmnext20')
							   .text('Display next 20 results')
							   .hide();
	$('#bottombuttons').append(btmNextBtn);
	$("#btmnext20").on('click', function(){
		event.preventDefault();
		
		// *** TESTING ***
		console.log("btmnext20 clicked");

		searchButton = false;
		search(count, currentOffset);
	});
}

var search = function(num, offset) {
	var clearDisplay = function() {
		//clear the division of previous info
		$('#displayrow').empty();
		// $('#bottombuttons').hide();
	};

	var clearSearchValues = function() {
		$('#zipCode').val("");
		$('#animaltype').val("");
		$('#breed').val("");
	};

	var showTopButtons = function() {
		
		// *** TESTING ***
		console.log("showTopButtons called");

		$("#topnext20").show();
		if (lastoffset > 0) {
			$("#toplast20").show();
		}
	};

	var showBottomButtons = function() {
		
		// *** TESTING ***
		console.log("showBottomButtons called");

		$("#btmnext20").show();
		if (lastoffset > 0) {
			$("#btmlast20").show();
		}

	};

	clearDisplay();

	if (searchButton === true) {
		// *** NEED TO ESCAPE CODE INJECTION	
		var zipCode = $('#zipCode').val().trim();
		var typeAnimal = $('#animaltype').val().trim().toLowerCase();
		var breed = $('#breed').val().trim().toLowerCase();
		// *********************************
		createSearchButtons();
	} else {
		// *** NEED TO ESCAPE CODE INJECTION
		zipCode = localStorage.getItem("zipCode");
		typeAnimal = localStorage.getItem("typeAnimal");
		breed = localStorage.getItem("breed");
		// *********************************
	}

	count = num;
	currentOffset = offset;
	
	// *** TESTING ***
	console.log("query count: ", count);
	console.log("query lastoffset: ", lastoffset);
	console.log("query currentOffset: ", currentOffset);


	var key = "dced171da3616db767dede0c93058383";
	//url for ajax request w/ variables
	var queryURL = 	"http://api.petfinder.com/pet.find?format=json" +
					"&key=" + key +
					"&callback=" + "?" +
					"&location=" + zipCode +
					"&count=" + count +
					"&animal=" + typeAnimal +
					"&output=" + "full" +
					"&offset=" + currentOffset;
	
	localStorage.setItem("zipCode", zipCode);	
	localStorage.setItem("typeAnimal", typeAnimal);
	localStorage.setItem("breed", breed);
	
	if (breed.length > 1){
		queryURL += "&breed=" + breed;
	}

	// *** TESTING ***
	console.log(queryURL);

	// API call for page of pets
	$.getJSON({
		url: queryURL,
		method: 'GET',
	}).done(function(response){
		
		// *** TESTING ***
		console.log(response);

		//list of pets from response object
		var petArray = response.petfinder.pets.pet;
		createPetTable(petArray);
		// showTopButtons();
		clearSearchValues();
		// Create event listener for animal images
		$('.animalpic').on('click', animalDetails)
	});

	lastoffset = currentOffset;
	currentOffset += count;

	// *** TESTING ***
	console.log("post-query count: ", count);
	console.log("post-query lastoffset: ", lastoffset);
	console.log("post-query currentOffset: ", currentOffset);


	showTopButtons();
	setTimeout(showBottomButtons, 800);
};

var createPetTable = function(array) {

	var limit = array.length;
	var table = $("<table>").html("<tbody></tbody>");
	var rowCount = 1;

	for (i = 0; i < limit; i++) {
		if (i % 5 == 0) {
			var tr = $("<tr>").attr("id", ("tr" + rowCount));
			table.append(tr);
			rowCount += 1;
		}

		var name = $("<p>").attr("class", "animalname").text(array[i].name.$t);

		var breed = array[i].breeds.breed;
			if (breed != null && $.isArray(breed)) {
				var breedVal = breed[0].$t + ", " + breed[1].$t;
			} else if (breed != null) {
				var breedVal = breed.$t; 
			} else {
				var breedVal = "Unknown";
			}
			breed = $("<p>").text("Breed: " + breedVal);

		var sex = array[i].sex.$t;
			if (sex === "M") {
				name.css("color", "#428BCA");
			} else if (sex === "F") {
				name.css("color", "#FF80AB");
			}

		var age = $("<p>").text("Age: " + array[i].age.$t);

		var pic = array[i].media.photos;
			if (pic === undefined) {
				var picVal = "../assets/images/noimage.jpg";
				var classVal = "nopic";
			} else {
				var picVal = pic.photo[1].$t;
				var classVal = "animalpic";
			}
			pic = $("<img>").attr({src: picVal, animalId: array[i].id.$t, class: classVal});

		var td = $("<td>").attr("id", ("pic" + i)).append(pic, name, breed, age);
		tr.append(td);

	}
	$("#displayrow").append(table);

};

var animalDetails = function(object) {

	$('.next20').hide();
	$('#displaytext').hide();
	$('#initialdisplay').hide();
	$('#picturedisplay').show();

	//create new button to go back and append to search section
	//upon clicking back button, showanimal div empties all pictures and hides, while initialdisplay div reappears and back button is removed
	var newBtn = $('<button>').attr({"class": "btn btn-primary", "id": "backbtn"}).text("Go Back").on('click', function(){
		$('#showanimal').empty();
		$('#picturedisplay').hide();
		$('#initialdisplay').show();
		$('#displaytext').show();
		$('#backbtn').remove();
		$('.next20').show();
		$('#displaytext').show();
	});
	$('#indbuttondisplay').append(newBtn);

	//retrieve the animal id assigned to the picture for use in ajax request
	var thisAnimal = $(this).attr('animalId');
	var key = "dced171da3616db767dede0c93058383";
	//url for ajax request w/ variables
	var queryURL = 	"http://api.petfinder.com/pet.get?format=json" +
					"&key=" + key +
					"&callback=" + "?" +
					"&output=" + "full" +
					"&id=" + thisAnimal;
	// API call for selected pet
	$.getJSON({
		url: queryURL,
		method: 'GET',
	}).done(function(response){
		var picsArray = response.petfinder.pet.media.photos.photo;
		var thisShelter = response.petfinder.pet.shelterId.$t;
		queryURL = 	"http://api.petfinder.com/shelter.get?format=json" +
					"&key=" + key +
					"&callback=" + "?" +
					"&id=" + thisShelter;
		$.getJSON({
			url: queryURL,
			method: 'GET',
		}).done(function(response){
			var latitude = response.petfinder.shelter.latitude.$t;
			var longitude = response.petfinder.shelter.longitude.$t;
			//store shelter lat and long in local storage for easy retrieval for google maps api.
			localStorage.setItem("Latitude", latitude);
			localStorage.setItem("Longitude", longitude);

			// Google Maps API call	
			initMap(latitude, longitude);
			
			// Append shelter info
			displayShelterInfo(response);
		});

		displayAnimalPhotos(picsArray, response);		
	});
};

var displayAnimalPhotos = function(array, response) {
	for (var i = 0; i < array.length; i++) {
				
		//var of sources for pictures
		var sources = array[i].$t;

		//search through sources and if they have a width of 500, then..
		if (sources.search('width=500') >= 1){
			//create an image for each picture returned w/ assigned source
			var newImgDiv = $('<img>').attr('src', sources);
			//append to showanimal div (formerly hidden)
			$('#showanimal').append(newImgDiv);
		}		
	}

	var newDiv = $("<div>");
	var newName = $("<p>").attr("id", "indname").text(response.petfinder.pet.name.$t);
	var sex = response.petfinder.pet.sex.$t;
		if (sex === "M"){
			newName.css('color', '#428BCA');
		} else if (sex === "F") {
			newName.css('color', '#ff80ab');
		}
	var description = $("<p>").attr("id", "description").text(response.petfinder.pet.description.$t);
	newDiv.append(newName, description);

	$('#showanimal').append(newDiv);
};

var initMap = function(lat, lng) {
	$("#showanimal").append("<div id=\"map\"></div>");
	latitude = parseInt(lat);
	longitude = parseInt(lng);

	// *** TESTING ***
	console.log("lat: ", latitude, "long: ", longitude);
	
	var position = {lat: latitude, lng: longitude};
	var map = new google.maps.Map(document.getElementById('map'), {
		center: position,
		zoom: 12
	});
	var marker = new google.maps.Marker({
		position: position,
		map: map
	});
};

var formatContactInfo = function(object, appendDiv) {
	var div = $("<div>").attr("class", "contactinfo");
	var value;
	for (key in object) {
		if (object[key] === undefined) {
			value = "(information not given)";
		} else {
			value = object[key];
		}
		div.append("<p>" + key + ":&nbsp;&nbsp;&nbsp;" + value + "</p>");
	}
	div.appendTo($("#" + appendDiv));
};

var displayShelterInfo = function(object) {
	var info = {
		Name: object.petfinder.shelter.name.$t,
		Address: object.petfinder.shelter.address1.$t,
		City: object.petfinder.shelter.city.$t,
		State: object.petfinder.shelter.state.$t,
		Zip: object.petfinder.shelter.zip.$t,
		Phone: object.petfinder.shelter.phone.$t,
		Email: object.petfinder.shelter.email.$t
	};

	formatContactInfo(info, "showanimal");
};



//hides the picture display on doc ready
$(document).ready(function() {
	$('#picturedisplay').hide();
});

//click event for search button
$("#searchButton").on('click', function(event) {
	event.preventDefault();
	
	var inputCheck = function(zip, animal) {
		var zipValid = false;
		var animalValid = false;

		if (Number.isInteger(parseInt(zip)) && (zip.length === 5) && (zip > 0)) {
			zipValid = true;
		} else {
			alert("The zip code you entered is invalid.  Please check and try again.");
		}

		if (animal.length > 2) {
			animalValid = true;
		} else {
			alert("The Type of Animal you have entered is invalid.  Please check and try again.");
		}

		if (zipValid === true && animalValid === true) {
			return true;
		} else {
			return false;
		}
	};

	// *** NEED TO ESCAPE CODE INJECTION
	var zipCode = $("#zipCode").val().trim();
	var typeAnimal = $('#animaltype').val().trim();
	// *********************************

	var inputValid = inputCheck(zipCode, typeAnimal);
	if (inputValid !== true) {
		return;
	}
	searchButton = true;
	search(count, 0);

});