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

						if($.isArray(petArray[i].breeds.breed)){
							var firstBreed = petArray[i].breeds.breed[0].$t;
							var secondBreed = petArray[i].breeds.breed[1].$t;
							breed = $("<p><strong>Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
						} else{
							breed = $('<p><strong> Breed: </strong>' + petArray[i].breeds.breed.$t + '</p>');
						}
		

					var sex = petArray[i].sex.$t;

						if (sex == "M"){
							name.css("color", '#428BCA');
						} else {
							name.css('color', "#ff80ab");
						}

					var age = $('<p><strong> Age: </strong>' + petArray[i].age.$t + '</p>');				
					 
					//picture of animal
					var pic = "";

					if(petArray[i].media.photos == null){
						pic = "../assets/images/noimage.jpg";
						var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[i].id.$t).attr('class', "nopic");
					} else {
						pic = petArray[i].media.photos.photo[1].$t;
						var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[i].id.$t).attr('class', "animalpic");
					}


					//append all info as td
					td.append(animalPicture);
					td.append(name);
					td.append(breed);
					td.append(age);
					$('#tr1').append(td);
										
				//closes 1st for loop
				}

				//loop for next 5 objects to append to second <tr>
				for (var j = i; j < 10; j++) {
					
					//create new div for each animal w/ unique id for wrapping content
					var td= $('<td id = "pic'+[j]+'">');

					//animal name
					var name = $('<p class = "animalname">' + petArray[j].name.$t + '</p>');	

					var breed = "";

						if($.isArray(petArray[j].breeds.breed)){
							var firstBreed = petArray[j].breeds.breed[0].$t;
							var secondBreed = petArray[j].breeds.breed[1].$t;
							breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
						} else{
							breed = $('<p><em> Breed: </strong>' + petArray[j].breeds.breed.$t + '</p>');
						}
				

						var sex = petArray[j].sex.$t;

						if (sex == "M"){
							name.css("color", '#428BCA');
						} else {
							name.css('color', "#ff80ab");
						}

					var age = $('<p><strong> Age: </strong>' + petArray[j].age.$t + '</p>');				
					 
					//picture of animal
					var pic = "";

					if(petArray[j].media.photos == null){
						pic = "../assets/images/noimage.jpg";
						var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[j].id.$t).attr('class', "nopic");

					} else {
						pic = petArray[j].media.photos.photo[1].$t;
						var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[j].id.$t).attr('class', "animalpic");

					}

					
					//append all info as td
					td.append(animalPicture);
					td.append(name);
					td.append(breed);
					td.append(age);
					$('#tr2').append(td);
										
				//closes 2nd for loop
				}

				//loop for 3rd 5 objects to append to 3rd <tr>
				for (var k = j; k < 15; k++) {
					
					//create new div for each animal w/ unique id for wrapping content
					var td= $('<td id = "pic'+[k]+'">');

					//animal name
					var name = $('<p class="animalname">' + petArray[k].name.$t + '</p>');	

					var breed = "";

						if($.isArray(petArray[k].breeds.breed)){
							var firstBreed = petArray[k].breeds.breed[0].$t;
							var secondBreed = petArray[k].breeds.breed[1].$t;
							breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
						} else{
							breed = $('<p><strong> Breed: </strong>' + petArray[k].breeds.breed.$t + '</p>');
						}
					

					var sex = petArray[k].sex.$t;

						if (sex == "M"){
							name.css("color", '#428BCA');
						} else {
							name.css('color', "#ff80ab");
						}

					var age = $('<p><strong> Age: </strong>' + petArray[k].age.$t + '</p>');				
					 
					//picture of animal
					var pic = "";

					if(petArray[i].media.photos == null){
						pic = "../assets/images/noimage.jpg";
						var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[k].id.$t).attr('class', "nopic");
					} else {
						pic = petArray[k].media.photos.photo[1].$t;
						var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[k].id.$t).attr('class', "animalpic");
					}

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
			
<<<<<<< HEAD
					//append all info as td
					td.append(animalPicture);
					td.append(name);
					td.append(breed);
					td.append(age);
					$('#tr3').append(td);
										
				//closes 3rd for loop
				}

				//loop for last 5 objects to append to last <tr>
				for (var l = k; l < 20; l++) {
					
					//create new div for each animal w/ unique id for wrapping content
					var td= $('<td id = "pic'+[l]+'">');

					//animal name
					var name = $('<p class = "animalname">' + petArray[l].name.$t + '</p>');

					var breed = "";

						if($.isArray(petArray[l].breeds.breed)){
							var firstBreed = petArray[l].breeds.breed[0].$t;
							var secondBreed = petArray[l].breeds.breed[1].$t;
							breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
						} else{
							breed = $('<p><strong> Breed: </strong>' + petArray[l].breeds.breed.$t + '</p>');
						}
					

					var sex = petArray[l].sex.$t;

						if (sex == "M"){
							name.css("color", '#428BCA');
						} else {
							name.css('color', "#ff80ab");
						}

					var age = $('<p><strong> Age: </strong>' + petArray[l].age.$t + '</p>');		
					 
					//picture of animal
					var pic = "";

					if(petArray[i].media.photos == null){
						pic = "../assets/images/noimage.jpg";
						var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[l].id.$t).attr('class', "nopic");
					} else {
						pic = petArray[l].media.photos.photo[1].$t;
						var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[l].id.$t).attr('class', "animalpic");
					}


					//append all info as td
					td.append(animalPicture);
					td.append(name);
					td.append(breed);
					td.append(age);
					$('#tr4').append(td);
										
				//closes 4th for loop
				}
			
				


				$('#zipCode').val("");
				$('#animaltype').val("");
				$('#breed').val("");

				//when user clicks on animal image
				$('.animalpic').on('click', function(){

					$('.next20').hide();
					$('#displaytext').hide();


					//create new button to go back
					var newBtn = $('<button>').attr('id', 'backbtn').text("Go Back").addClass('btn btn-primary');
					//append new button after search button
					$('#indbuttondisplay').append(newBtn);

					//hide search results div and show pictures of animal
					$('#initialdisplay').hide();
					$('#displaytext').hide();
					$('#picturedisplay').show();

					//retrieve the animal id assigned to the picture for use in ajax request
					var thisAnimal = $(this).attr('animalId');
					console.log(thisAnimal);

					//ajax request to retrieve selected animal
					var queryURL = "http://api.petfinder.com/pet.get?format=json&key=dced171da3616db767dede0c93058383&callback=?&id="+thisAnimal + "&output=full";

					$.getJSON({
						url: queryURL,
						method: 'GET',
					}).done(function(response){
						console.log(response);

						//array of pictures from response object
						var picsArray = response.petfinder.pet.media.photos.photo;
						console.log(picsArray);

						var thisShelter = response.petfinder.pet.shelterId.$t;
						console.log(thisShelter);

						var queryURL = "http://api.petfinder.com/shelter.get?format=json&key=dced171da3616db767dede0c93058383&callback=?&id=" + thisShelter;

						$.getJSON({
							url: queryURL,
							method: 'GET',
						}).done(function(response){
							console.log(response);

							var latitude = response.petfinder.shelter.latitude.$t;
							console.log(latitude);
							var longitude = response.petfinder.shelter.longitude.$t;
							console.log(longitude);
							//store shelter lat and long in local storage for easy retrieval for google maps api.
							localStorage.setItem("Latitude", latitude);
							localStorage.setItem("Longitude", longitude);

//-----------------------------insert google maps api here ----------------------------------------------------------------------	

							var newDiv = $('<div class="contactinfo">');
							var shelterName = response.petfinder.shelter.name.$t;
							var shelterPhone = response.petfinder.shelter.phone.$t;
							var shelterEmail = response.petfinder.shelter.email.$t;
							var shelterAddress = response.petfinder.shelter.address1.$t;
							var shelterCity = response.petfinder.shelter.city.$t + ", " + response.petfinder.shelter.state.$t + " " + response.petfinder.shelter.zip.$t;

							newDiv.append(shelterName + "<br>");
							newDiv.append(shelterPhone + "<br>");
							newDiv.append(shelterEmail + "<br>");
							newDiv.append(shelterAddress + "<br>");
							newDiv.append(shelterCity + "<br>");

							$('#showanimal').append(newDiv);


						});

						

						for (var i = 0; i < picsArray.length; i++) {

						
							//var of sources for pictures
							var sources = picsArray[i].$t;

							//search through sources and if they have a width of 500, then..
							if (sources.search('width=500') >= 1){
								//create an image for each picture returned w/ assigned source
								var newImgDiv = $('<img>').attr('src', sources);
								}


							//append to showanimal div (formerly hidden)
							
							$('#showanimal').append(newImgDiv);

						

							//upon clicking back button, showanimal div empties all pictures and hides, while initialdisplay div reappears and back button is removed
							$('#backbtn').on('click', function(){

								$('#showanimal').empty();
								$('#picturedisplay').hide();
								$('#initialdisplay').show();
								$('#displaytext').show();
								$('#backbtn').remove();
								$('.next20').show();
								$('#displaytext').show();

							//closes back button click event	
							})	

						//closes for loop
						}

						var newDiv = $('<div>');
						var newName = $('<p id="indname">'+response.petfinder.pet.name.$t+'</p>');
						var sex = response.petfinder.pet.sex.$t;
							if (sex =="M"){
								newName.css('color', '#428BCA');
							} else {
								newName.css('color', '#ff80ab');
							}
						var description = $('<p id = "description">');
						description.text(response.petfinder.pet.description.$t);
						newDiv.append(newName);
						newDiv.append(description);

						$('#showanimal').append(newDiv);

					//closes promise		
					});

				//closes image click event	
				})
		

			//closes promise
			});

	//----------------- new button -------------------------------------------------------------------------------------------------
	//-------------------------------------------new button-----------------------------------------------------------------------

  			var newBtn = $('<btn>').addClass('btn btn-primary next20').attr('id', 'topnext20').text('Display next 20 results');
  			$('#buttondisplay').append(newBtn);
  			var btmBtn = $('<btn>').addClass('btn btn-primary next20').attr('id', 'btmnext20').text('Display next 20 results');
  			$('#bottombuttons').append(btmBtn);
  			

  			$('.next20').on('click', function(){

  				event.preventDefault();

  				$('#displayrow').empty();
  				$('#bottombuttons').hide();

  				var showButttons = function(){
  					$('#bottombuttons').show();
  				};

  				setTimeout(showButttons, 800);


				//zip code value
				var zipCode = localStorage.getItem("zipCode");
				console.log(zipCode);
				//animal type value
				var typeAnimal = localStorage.getItem("typeAnimal");
				console.log(typeAnimal);
				//breed value
				var breed = localStorage.getItem("breed");
				console.log(breed);
				//offset=count to return next 10 results
				lastoffset = lastoffset + 20;
				console.log(lastoffset);
				
				var queryURL = queryURL = "http://api.petfinder.com/pet.find?format=json&key=dced171da3616db767dede0c93058383&callback=?&location="+zipCode+"&count=20&animal="+typeAnimal+"&breed="+breed+"&output=full&offset="+ lastoffset;
				
				//url for ajax request w/ variables					
				$.getJSON({
					url: queryURL,
					method: 'GET',
				}).done(function(response){
					console.log(response);
=======
			// Append shelter info
			displayShelterInfo(response);
		});
>>>>>>> 76f4230baeb5264077f0dee0b34a07a67dc8d9ca

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

<<<<<<< HEAD
					$('#displayrow').append(table);


					//loop for first 5 objects to append to 1st <tr>
					for (var i = 0; i < 5; i++) {
						
						//create new div for each animal w/ unique id for wrapping content
						var td= $('<td id = "pic'+[i]+'">');

						//animal name
						var name = $('<p class="animalname">' + petArray[i].name.$t + '</p>');	

						var breed = "";

							if($.isArray(petArray[i].breeds.breed)){
								var firstBreed = petArray[i].breeds.breed[0].$t;
								var secondBreed = petArray[i].breeds.breed[1].$t;
								breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
							} else{
								breed = $('<p><strong> Breed: </strong>' + petArray[i].breeds.breed.$t + '</p>');
							}
							

						var sex = petArray[i].sex.$t;

						if (sex == "M"){
							name.css("color", '#428BCA');
						} else {
							name.css('color', "#ff80ab");
						};

						var age = $('<p><strong> Age: </strong>' + petArray[i].age.$t + '</p>');				
						 
						//picture of animal
						var pic = "";

						if(petArray[i].media.photos == null){
							pic = "../assets/images/noimage.jpg";
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[i].id.$t).attr('class', "nopic");
						} else {
							pic = petArray[i].media.photos.photo[1].$t;
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[i].id.$t).attr('class', "animalpic");
						}	


						//append all info as td
						td.append(animalPicture);
						td.append(name);
						td.append(breed);
						td.append(age);
						$('#tr1').append(td);
											
					//closes 1st for loop
					}

					//loop for next 5 objects to append to second <tr>
					for (var j = i; j < 10; j++) {
						
						//create new div for each animal w/ unique id for wrapping content
						var td= $('<td id = "pic'+[j]+'">');

						//animal name
						var name = $('<p class="animalname">' + petArray[j].name.$t + '</p>');	

						var breed = "";

							if($.isArray(petArray[j].breeds.breed)){
								var firstBreed = petArray[j].breeds.breed[0].$t;
								var secondBreed = petArray[j].breeds.breed[1].$t;
								breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
							} else{
								breed = $('<p><strong> Breed: </strong>' + petArray[j].breeds.breed.$t + '</p>');
							}
							

						var sex = petArray[j].sex.$t;

						if (sex == "M"){
							name.css("color", '#428BCA');
						} else {
							name.css('color', "#ff80ab");
						}

						var age = $('<p><strong> Age: </strong>' + petArray[j].age.$t + '</p>');				
						 
						//picture of animal						
						var pic = "";

						if(petArray[j].media.photos == null){
							pic = "../assets/images/noimage.jpg";
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[j].id.$t).attr('class', "nopic");
						} else {
							pic = petArray[j].media.photos.photo[1].$t;
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[j].id.$t).attr('class', "animalpic");
						}

						//append all info as td
						td.append(animalPicture);
						td.append(name);
						td.append(breed);
						td.append(age);
						$('#tr2').append(td);
											
					//closes 2nd for loop
					}

					//loop for 3rd 5 objects to append to 3rd <tr>
					for (var k = j; k < 15; k++) {
						
						//create new div for each animal w/ unique id for wrapping content
						var td= $('<td id = "pic'+[k]+'">');

						//animal name
						var name = $('<p class="animalname">' + petArray[k].name.$t + '</p>');	

						var breed = "";

							if($.isArray(petArray[k].breeds.breed)){
								var firstBreed = petArray[k].breeds.breed[0].$t;
								var secondBreed = petArray[k].breeds.breed[1].$t;
								breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
							} else{
								breed = $('<p><strong> Breed: </strong>' + petArray[k].breeds.breed.$t + '</p>');
							}


						var sex = petArray[k].sex.$t;

						if (sex == "M"){
							name.css("color", '#428BCA');
						} else {
							name.css('color', "#ff80ab");
						}

						var age = $('<p><strong> Age: </strong>' + petArray[k].age.$t + '</p>');				
						 
						//picture of animal
						var pic = "";

						if(petArray[k].media.photos == null){
							pic = "../assets/images/noimage.jpg";
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[k].id.$t).attr('class', "nopic");
						} else {
							pic = petArray[k].media.photos.photo[1].$t;
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[k].id.$t).attr('class', "animalpic");
						}


						//append all info as td
						td.append(animalPicture);
						td.append(name);
						td.append(breed);
						td.append(age);
						$('#tr3').append(td);
											
					//closes 3rd for loop
					}

					//loop for last 5 objects to append to last <tr>
					for (var l = k; l < 20; l++) {
						
						//create new div for each animal w/ unique id for wrapping content
						var td= $('<td id = "pic'+[l]+'">');

						//animal name
						var name = $('<p class = "animalname">' + petArray[l].name.$t + '</p>');

						var breed = "";

							if($.isArray(petArray[l].breeds.breed)){
								var firstBreed = petArray[l].breeds.breed[0].$t;
								var secondBreed = petArray[l].breeds.breed[1].$t;
								breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
							} else{
								breed = $('<p><strong> Breed: </strong>' + petArray[l].breeds.breed.$t + '</p>');
							}
					

						var sex = petArray[l].sex.$t;

						if (sex == "M"){
							name.css("color", '#428BCA');
						} else {
							name.css('color', "#ff80ab");
						}

						var age = $('<p> Age: ' + petArray[l].age.$t + '</p>');		
						 
						//picture of animal
						var pic = "";

						if(petArray[l].media.photos == null){
							pic = "../assets/images/noimage.jpg";
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[l].id.$t).attr('class', "nopic");
						} else {
							pic = petArray[l].media.photos.photo[1].$t;
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[l].id.$t).attr('class', "animalpic");
						}

						//append all info as td
						td.append(animalPicture);
						td.append(name);
						td.append(breed);
						td.append(age);
						$('#tr4').append(td);
											
					//closes 4th for loop
					}


					//when user clicks on animal image
					$('.animalpic').on('click', function(){

						//create new button to go back
						var newBtn = $('<button>').attr('id', 'backbtn').text("Go Back").addClass('btn btn-primary');
						//append new button after search button
						$('#indbuttondisplay').append(newBtn);

						//hide search results div and show pictures of animal
						$('#initialdisplay').hide();
						$('#picturedisplay').show();
						$('.next20').hide();
						$('.last20').hide();
						$('#displaytext').hide();

						//retrieve the animal id assigned to the picture for use in ajax request
						var thisAnimal = $(this).attr('animalId');
						console.log(thisAnimal);

						//ajax request to retrieve selected animal
						var queryURL = "http://api.petfinder.com/pet.get?format=json&key=dced171da3616db767dede0c93058383&callback=?&id="+thisAnimal + "&output=full";

						$.getJSON({
							url: queryURL,
							method: 'GET',
						}).done(function(response){
							console.log(response);

							//array of pictures from response object
							var picsArray = response.petfinder.pet.media.photos.photo;
							console.log(picsArray);

							var thisShelter = response.petfinder.pet.shelterId.$t;
							console.log(thisShelter);

							var queryURL = "http://api.petfinder.com/shelter.get?format=json&key=dced171da3616db767dede0c93058383&callback=?&id=" + thisShelter;

							$.getJSON({
								url: queryURL,
								method: 'GET',
							}).done(function(response){
								console.log(response);

								var latitude = response.petfinder.shelter.latitude.$t;
								console.log(latitude);
								var longitude = response.petfinder.shelter.longitude.$t;
								console.log(longitude);
								//store shelter lat and long in local storage for easy retrieval for google maps api.
								localStorage.setItem("Latitude", latitude);
								localStorage.setItem("Longitude", longitude);

//------------------------------------------Insert google maps api here------------------------------------------------------------------

								var newDiv = $('<div class="contactinfo">');
								var shelterName = response.petfinder.shelter.name.$t;
								var shelterPhone = response.petfinder.shelter.phone.$t;
								var shelterEmail = response.petfinder.shelter.email.$t;
								var shelterAddress = response.petfinder.shelter.address1.$t;
								var shelterCity = response.petfinder.shelter.city.$t + ", " + response.petfinder.shelter.state.$t + " " + response.petfinder.shelter.zip.$t;

								newDiv.append(shelterName + "<br>");
								newDiv.append(shelterPhone + "<br>");
								newDiv.append(shelterEmail + "<br>");
								newDiv.append(shelterAddress + "<br>");
								newDiv.append(shelterCity + "<br>");

								$('#showanimal').append(newDiv);

							});


							for (var i = 0; i < picsArray.length; i++) {

								//var of sources for pictures
								var sources = picsArray[i].$t;

								//search through the img sources, if they have a width of 500 then..
								if (sources.search('width=500') >= 1){
									//create an img tag for each picture returned w/ assigned source
									var newImgDiv = $('<img>').attr('src', sources);
								}
								
								//append to showanimal div (formerly hidden)
								$('#showanimal').append(newImgDiv);

								//upon clicking back button, showanimal div empties all pictures and hides, while initialdisplay div reappears and back button is removed
								$('#backbtn').on('click', function(){

									$('#showanimal').empty();
									$('#picturedisplay').hide();
									$('#initialdisplay').show();
									$('#backbtn').remove();
									$('.next20').show();
									$('.last20').show();
									$('#displaytext').show();

								//closes back button click event	
								})	

							//closes for loop
							}

							var newDiv = $('<div>');
							var newName = $('<p id = "indname">'+response.petfinder.pet.name.$t+'</p>');
							var sex = response.petfinder.pet.sex.$t;
							if (sex =="M"){
								newName.css('color', '#428BCA');
							} else {
								newName.css('color', '#ff80ab');
							}
							var description = $('<p id = "description">');
							description.text(response.petfinder.pet.description.$t);
							newDiv.append(newName);
							newDiv.append(description);

							$('#showanimal').append(newDiv);

						//closes promise		
						});

					//closes image click event	
					})
			

				//closes promise
				});

//-----------------------------------go back button--------------------------------------------------------------------------------------
//-----------------------------------------------------------gobackbutton---------------------------------------------------------------
				if (lastoffset === 20){

					var newBtn = $('<btn>').addClass('btn btn-primary last20').attr('id', 'toplast20').text('Display previous 20 results');
  					$('#buttondisplay').prepend(newBtn);
		  			var btmBtn = $('<btn>').addClass('btn btn-primary last20').attr('id', 'btmlast20').text('Display previous 20 results');
		  			$('#bottombuttons').prepend(btmBtn);

		  			$('.last20').on('click', function(){

		  				event.preventDefault();

		  				$('#displayrow').empty();
		  				$('#bottombuttons').hide();

  						var showButttons = function(){
  							$('#bottombuttons').show();
  						};

  						setTimeout(showButttons, 800);

						//zip code value
						var zipCode = localStorage.getItem("zipCode");
						console.log(zipCode);
						//animal type value
						var typeAnimal = localStorage.getItem("typeAnimal");
						console.log(typeAnimal);
						//breed value
						var breed = localStorage.getItem("breed");
						console.log(breed);
						//offset=count to return next 10 results
						lastoffset = lastoffset - 20;
						console.log(lastoffset);
						
						var queryURL = queryURL = "http://api.petfinder.com/pet.find?format=json&key=dced171da3616db767dede0c93058383&callback=?&location="+zipCode+"&count=20&animal="+typeAnimal+"&breed="+breed+"&output=full&offset="+ lastoffset;
						
						//url for ajax request w/ variables					
						$.getJSON({
							url: queryURL,
							method: 'GET',
						}).done(function(response){
							console.log(response);

							//list of pets from response object
							var petArray = response.petfinder.pets.pet;

							var table = $('<table><tr id = "tr1"></tr><tr id = "tr2"></tr><tr id = "tr3"></tr><tr id = "tr4"></tr></table>');
						

							$('#displayrow').append(table);


							//loop for first 5 objects to append to 1st <tr>
							for (var i = 0; i < 5; i++) {
								
								//create new div for each animal w/ unique id for wrapping content
								var td= $('<td id = "pic'+[i]+'">');

								//animal name
								var name = $('<p class="animalname">' + petArray[i].name.$t + '</p>');	

								var breed = "";

									if($.isArray(petArray[i].breeds.breed)){
										var firstBreed = petArray[i].breeds.breed[0].$t;
										var secondBreed = petArray[i].breeds.breed[1].$t;
										breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
									} else{
										breed = $('<p><strong> Breed: </strong>' + petArray[i].breeds.breed.$t + '</p>');
									}
									

								var sex = petArray[i].sex.$t;

								if (sex == "M"){
									name.css("color", '#428BCA');
								} else {
									name.css('color', "#ff80ab");
								}

								var age = $('<p><strong> Age: </strong>' + petArray[i].age.$t + '</p>');				
								 
								//picture of animal
								var pic = "";

								if(petArray[i].media.photos == null){
									pic = "../assets/images/noimage.jpg";
									var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[i].id.$t).attr('class', "nopic");
								} else {
									pic = petArray[i].media.photos.photo[1].$t;
									var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[i].id.$t).attr('class', "animalpic");
								}

				
								//append all info as td
								td.append(animalPicture);
								td.append(name);
								td.append(breed);
								td.append(age);
								$('#tr1').append(td);
													
							//closes 1st for loop
							}

							//loop for next 5 objects to append to second <tr>
							for (var j = i; j < 10; j++) {
								
								//create new div for each animal w/ unique id for wrapping content
								var td= $('<td id = "pic'+[j]+'">');

								//animal name
								var name = $('<p class="animalname">' + petArray[j].name.$t + '</p>');	

								var breed = "";

									if($.isArray(petArray[j].breeds.breed)){
										var firstBreed = petArray[j].breeds.breed[0].$t;
										var secondBreed = petArray[j].breeds.breed[1].$t;
										breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
									} else{
										breed = $('<p><strong> Breed: </strong>' + petArray[j].breeds.breed.$t + '</p>');
									}
									

								var sex = petArray[j].sex.$t;

								if (sex == "M"){
									name.css("color", '#428BCA');
								} else {
									name.css('color', "#ff80ab");
								}

								var age = $('<p><strong> Age: </strong>' + petArray[j].age.$t + '</p>');				
								 
								//picture of animal						
								var pic = "";

								if(petArray[j].media.photos == null){
									pic = "../assets/images/noimage.jpg";
									var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[j].id.$t).attr('class', "nopic");
								} else {
									pic = petArray[j].media.photos.photo[1].$t;
									var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[j].id.$t).attr('class', "animalpic");
								}

								
								//append all info as td
								td.append(animalPicture);
								td.append(name);
								td.append(breed);
								td.append(age);
								$('#tr2').append(td);
													
							//closes 2nd for loop
							}

							//loop for 3rd 5 objects to append to 3rd <tr>
							for (var k = j; k < 15; k++) {
								
								//create new div for each animal w/ unique id for wrapping content
								var td= $('<td id = "pic'+[k]+'">');

								//animal name
								var name = $('<p class="animalname">' + petArray[k].name.$t + '</p>');	

								var breed = "";

									if($.isArray(petArray[k].breeds.breed)){
										var firstBreed = petArray[k].breeds.breed[0].$t;
										var secondBreed = petArray[k].breeds.breed[1].$t;
										breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
									} else{
										breed = $('<p> Breed: ' + petArray[k].breeds.breed.$t + '</p>');
									}


								var sex = petArray[k].sex.$t;

								if (sex == "M"){
									name.css("color", '#428BCA');
								} else {
									name.css('color', "#ff80ab");
								}

								var age = $('<p><strong> Age: </strong>' + petArray[k].age.$t + '</p>');				
								 
								//picture of animal
								var pic = "";

								if(petArray[k].media.photos == null){
									pic = "../assets/images/noimage.jpg";
									var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[k].id.$t).attr('class', "nopic");
								} else {
									pic = petArray[k].media.photos.photo[1].$t;
									var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[k].id.$t).attr('class', "animalpic");
								}

					
								//append all info as td
								td.append(animalPicture);
								td.append(name);
								td.append(breed);
								td.append(age);
								$('#tr3').append(td);
													
							//closes 3rd for loop
							}

							//loop for last 5 objects to append to last <tr>
							for (var l = k; l < 20; l++) {
								
								//create new div for each animal w/ unique id for wrapping content
								var td= $('<td id = "pic'+[l]+'">');

								//animal name
								var name = $('<p class="animalname">' + petArray[l].name.$t + '</p>');

								var breed = "";

									if($.isArray(petArray[l].breeds.breed)){
										var firstBreed = petArray[l].breeds.breed[0].$t;
										var secondBreed = petArray[l].breeds.breed[1].$t;
										breed = $("<p><strong> Breeds: </strong>" + firstBreed + ", " + secondBreed + "</p>");							
									} else{
										breed = $('<p><strong> Breed: </strong>' + petArray[l].breeds.breed.$t + '</p>');
									}
							

								var sex = petArray[l].sex.$t;

								if (sex == "M"){
									name.css("color", '#428BCA');
								} else {
									name.css('color', "#ff80ab");
								};

								var age = $('<p><strong> Age: </strong>' + petArray[l].age.$t + '</p>');		
								 
								//picture of animal
								var pic = "";

								if(petArray[l].media.photos == null){
									pic = "../assets/images/noimage.jpg";
									var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[l].id.$t).attr('class', "nopic");
								} else {
									pic = petArray[l].media.photos.photo[1].$t;
									var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[l].id.$t).attr('class', "animalpic");
								}


								//append all info as td
								td.append(animalPicture);
								td.append(name);
								td.append(breed);
								td.append(age);
								$('#tr4').append(td);
													
							//closes 4th for loop
							}


							//when user clicks on animal image
							$('.animalpic').on('click', function(){

								//create new button to go back
								var newBtn = $('<button>').attr('id', 'backbtn').text("Go Back").addClass('btn btn-primary');
								//append new button after search button
								$('#indbuttondisplay').append(newBtn);

								//hide search results div and show pictures of animal
								$('#initialdisplay').hide();
								$('#picturedisplay').show();
								$('.next20').hide();
								$('.last20').hide();
								$('#displaytext').hide();

								//retrieve the animal id assigned to the picture for use in ajax request
								var thisAnimal = $(this).attr('animalId');
								console.log(thisAnimal);

								//ajax request to retrieve selected animal
								var queryURL = "http://api.petfinder.com/pet.get?format=json&key=dced171da3616db767dede0c93058383&callback=?&id="+thisAnimal + "&output=full";

								$.getJSON({
									url: queryURL,
									method: 'GET',
								}).done(function(response){
									console.log(response);

									//array of pictures from response object
									var picsArray = response.petfinder.pet.media.photos.photo;
									console.log(picsArray);

									var thisShelter = response.petfinder.pet.shelterId.$t;
									console.log(thisShelter);

									var queryURL = "http://api.petfinder.com/shelter.get?format=json&key=dced171da3616db767dede0c93058383&callback=?&id=" + thisShelter;

									$.getJSON({
										url: queryURL,
										method: 'GET',
									}).done(function(response){
										console.log(response);

										var latitude = response.petfinder.shelter.latitude.$t;
										console.log(latitude);
										var longitude = response.petfinder.shelter.longitude.$t;
										console.log(longitude);
										//store shelter lat and long in local storage for easy retrieval for google maps api.
										localStorage.setItem("Latitude", latitude);
										localStorage.setItem("Longitude", longitude);

		//------------------------------------------Insert google maps api here------------------------------------------------------------------

										var newDiv = $('<div class="contactinfo">');
										var shelterName = response.petfinder.shelter.name.$t;
										var shelterPhone = response.petfinder.shelter.phone.$t;
										var shelterEmail = response.petfinder.shelter.email.$t;
										var shelterAddress = response.petfinder.shelter.address1.$t;
										var shelterCity = response.petfinder.shelter.city.$t + ", " + response.petfinder.shelter.state.$t + " " + response.petfinder.shelter.zip.$t;

										newDiv.append(shelterName + "<br>");
										newDiv.append(shelterPhone + "<br>");
										newDiv.append(shelterEmail + "<br>");
										newDiv.append(shelterAddress + "<br>");
										newDiv.append(shelterCity + "<br>");

										$('#showanimal').append(newDiv);

									});


									for (var i = 0; i < picsArray.length; i++) {

										//var of sources for pictures
										var sources = picsArray[i].$t;

										//search through the img sources, if they have a width of 500 then..
										if (sources.search('width=500') >= 1){
											//create an img tag for each picture returned w/ assigned source
											var newImgDiv = $('<img>').attr('src', sources);
										}
										
										//append to showanimal div (formerly hidden)
										$('#showanimal').append(newImgDiv);

										//upon clicking back button, showanimal div empties all pictures and hides, while initialdisplay div reappears and back button is removed
										$('#backbtn').on('click', function(){

											$('#showanimal').empty();
											$('#picturedisplay').hide();
											$('#initialdisplay').show();
											$('#backbtn').remove();
											$('.next20').show();
											$('.last20').show();
											$('#displaytext').show();

										//closes back button click event	
										})	

									//closes for loop
									}

									var newDiv = $('<div>');
									var newName = $('<p id="indname">'+response.petfinder.pet.name.$t+'</p>');
									var sex = response.petfinder.pet.sex.$t;
									if (sex =="M"){
										newName.css('color', '#428BCA');
									} else {
										newName.css('color', '#ff80ab');
									}
									var description = $('<p id = "description">');
									description.text(response.petfinder.pet.description.$t);
									newDiv.append(newName);
									newDiv.append(description);

									$('#showanimal').append(newDiv);

								//closes promise		
								});

							//closes image click event	
							})
					

						//closes promise
						});

					if (lastoffset < 20){
						$('.last20').remove();
					}
					//closesdisplay last 10 results
		  			});

				//closes if statement
				}

			//closesdisplay next 10 results
  			})



		//closing tags for search button click event
		});
=======
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
>>>>>>> 76f4230baeb5264077f0dee0b34a07a67dc8d9ca

});