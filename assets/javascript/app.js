	//hides the picture display on doc ready
	$(document).ready(function(){
		$('#picturedisplay').hide();
	})

	//checks to see if the form inputs are filled, if so the search button is enabled by removing disabled attribute	
	var inputCheck = function() {
		$('input').on('keyup', function(){

			if ($('#zipCode').val().length === 5 && $('#animaltype').val().length > 2){
				$('#searchButton').removeAttr('disabled');
			}	
		});
	};

	inputCheck();


		//click event for search button
		$("#searchButton").on('click', function(event){
			event.preventDefault();
			//disable search button until form input is completed
			$('#searchButton').attr('disabled', 'disabled');
			//remove next 10 button
			$('.next20').remove();
			$('.last20').remove();
			//clear the division of previous info
			$('#displayrow').empty();
			

			//zip code value
			var zipCode = $('#zipCode').val().trim();
			console.log(zipCode);
			localStorage.setItem("zipCode", zipCode);
			//animal type value
			var typeAnimal = $('#animaltype').val().trim();
			console.log(typeAnimal);
			localStorage.setItem("typeAnimal", typeAnimal);
			//breed value
			var breed = $('#breed').val().trim();
			console.log(breed);
			localStorage.setItem("breed", breed);
			//offset=count to return next 10 results
			var lastoffset = 0;

			var queryURL = "";
			//url for ajax request w/ variables
			if (breed.length > 1){
				queryURL = "http://api.petfinder.com/pet.find?format=json&key=dced171da3616db767dede0c93058383&callback=?&location="+zipCode+"&count=20&animal="+typeAnimal+"&breed="+breed+"&output=full&offset="+ lastoffset;
			} else {
				queryURL = "http://api.petfinder.com/pet.find?format=json&key=dced171da3616db767dede0c93058383&callback=?&location="+zipCode+"&count=20&animal="+typeAnimal+"&output=full&offset="+ lastoffset;
			}
			

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
					var name = $('<p>' + petArray[i].name.$t + '</p>');	

					var breed = "";

						if($.isArray(petArray[i].breeds.breed)){
							var firstBreed = petArray[i].breeds.breed[0].$t;
							var secondBreed = petArray[i].breeds.breed[1].$t;
							breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
						} else{
							breed = $('<p> Breed: ' + petArray[i].breeds.breed.$t + '</p>');
						}
		

					var sex = $('<p> Sex: ' + petArray[i].sex.$t + '</p>');

					var age = $('<p> Age: ' + petArray[i].age.$t + '</p>');				
					 
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
					td.append(sex);
					td.append(age);
					$('#tr1').append(td);
										
				//closes 1st for loop
				}

				//loop for next 5 objects to append to second <tr>
				for (var j = i; j < 10; j++) {
					
					//create new div for each animal w/ unique id for wrapping content
					var td= $('<td id = "pic'+[j]+'">');

					//animal name
					var name = $('<p>' + petArray[j].name.$t + '</p>');	

					var breed = "";

						if($.isArray(petArray[j].breeds.breed)){
							var firstBreed = petArray[j].breeds.breed[0].$t;
							var secondBreed = petArray[j].breeds.breed[1].$t;
							breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
						} else{
							breed = $('<p> Breed: ' + petArray[j].breeds.breed.$t + '</p>');
						}
				

					var sex = $('<p> Sex: ' + petArray[j].sex.$t + '</p>');

					var age = $('<p> Age: ' + petArray[j].age.$t + '</p>');				
					 
					//picture of animal
					var pic = "";

					if(petArray[i].media.photos == null){
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
					td.append(sex);
					td.append(age);
					$('#tr2').append(td);
										
				//closes 2nd for loop
				}

				//loop for 3rd 5 objects to append to 3rd <tr>
				for (var k = j; k < 15; k++) {
					
					//create new div for each animal w/ unique id for wrapping content
					var td= $('<td id = "pic'+[k]+'">');

					//animal name
					var name = $('<p>' + petArray[k].name.$t + '</p>');	

					var breed = "";

						if($.isArray(petArray[k].breeds.breed)){
							var firstBreed = petArray[k].breeds.breed[0].$t;
							var secondBreed = petArray[k].breeds.breed[1].$t;
							breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
						} else{
							breed = $('<p> Breed: ' + petArray[k].breeds.breed.$t + '</p>');
						}
					

					var sex = $('<p> Sex: ' + petArray[k].sex.$t + '</p>');

					var age = $('<p> Age: ' + petArray[k].age.$t + '</p>');				
					 
					//picture of animal
					var pic = "";

					if(petArray[i].media.photos == null){
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
					td.append(sex);
					td.append(age);
					$('#tr3').append(td);
										
				//closes 3rd for loop
				}

				//loop for last 5 objects to append to last <tr>
				for (var l = k; l < 20; l++) {
					
					//create new div for each animal w/ unique id for wrapping content
					var td= $('<td id = "pic'+[l]+'">');

					//animal name
					var name = $('<p id = "petname">' + petArray[l].name.$t + '</p>');

					var breed = "";

						if($.isArray(petArray[l].breeds.breed)){
							var firstBreed = petArray[l].breeds.breed[0].$t;
							var secondBreed = petArray[l].breeds.breed[1].$t;
							breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
						} else{
							breed = $('<p> Breed: ' + petArray[l].breeds.breed.$t + '</p>');
						}
					

					var sex = $('<p> Sex: ' + petArray[l].sex.$t + '</p>');

					var age = $('<p> Age: ' + petArray[l].age.$t + '</p>');		
					 
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
					td.append(sex);
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

	//----------------- new button --------------------------------------------------------------------------------------------//


  			var newBtn = $('<btn>').addClass('btn btn-primary next20').attr('id', 'topnext20').text('Display next 20 results');
  			$('#buttondisplay').append(newBtn);
  			var btmBtn = $('<btn>').addClass('btn btn-primary next20').attr('id', 'btmnext20').text('Display next 20 results');
  			$('#bottombuttons').append(btmBtn);

  			$('.next20').on('click', function(){

  				event.preventDefault();

  				$('#displayrow').empty();

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

					//list of pets from response object
					var petArray = response.petfinder.pets.pet;

					var table = $('<table><tr id = "tr1"></tr><tr id = "tr2"></tr><tr id = "tr3"></tr><tr id = "tr4"></tr></table>');
				

					$('#displayrow').append(table);


					//loop for first 5 objects to append to 1st <tr>
					for (var i = 0; i < 5; i++) {
						
						//create new div for each animal w/ unique id for wrapping content
						var td= $('<td id = "pic'+[i]+'">');

						//animal name
						var name = $('<p>' + petArray[i].name.$t + '</p>');	

						var breed = "";

							if($.isArray(petArray[i].breeds.breed)){
								var firstBreed = petArray[i].breeds.breed[0].$t;
								var secondBreed = petArray[i].breeds.breed[1].$t;
								breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
							} else{
								breed = $('<p> Breed: ' + petArray[i].breeds.breed.$t + '</p>');
							}
							

						var sex = $('<p> Sex: ' + petArray[i].sex.$t + '</p>');

						var age = $('<p> Age: ' + petArray[i].age.$t + '</p>');				
						 
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
						td.append(sex);
						td.append(age);
						$('#tr1').append(td);
											
					//closes 1st for loop
					}

					//loop for next 5 objects to append to second <tr>
					for (var j = i; j < 10; j++) {
						
						//create new div for each animal w/ unique id for wrapping content
						var td= $('<td id = "pic'+[j]+'">');

						//animal name
						var name = $('<p>' + petArray[j].name.$t + '</p>');	

						var breed = "";

							if($.isArray(petArray[j].breeds.breed)){
								var firstBreed = petArray[j].breeds.breed[0].$t;
								var secondBreed = petArray[j].breeds.breed[1].$t;
								breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
							} else{
								breed = $('<p> Breed: ' + petArray[j].breeds.breed.$t + '</p>');
							}
							

						var sex = $('<p> Sex: ' + petArray[j].sex.$t + '</p>');

						var age = $('<p> Age: ' + petArray[j].age.$t + '</p>');				
						 
						//picture of animal						
						var pic = "";

						if(petArray[j].media.photos == null){
							pic = "../assets/images/noimage.jpg";
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[j].id.$t).attr('class', "nopic");
						} else {
							pic = petArray[j].media.photos.photo[1].$t;
							var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[j].id.$t).attr('class', "animalpic");
						}

						//create new image with src = pic, and assigned attributes of animalid(unique identifier), and animalpic class
						


						//append all info as td
						//append all info as td
						td.append(animalPicture);
						td.append(name);
						td.append(breed);
						td.append(sex);
						td.append(age);
						$('#tr2').append(td);
											
					//closes 2nd for loop
					}

					//loop for 3rd 5 objects to append to 3rd <tr>
					for (var k = j; k < 15; k++) {
						
						//create new div for each animal w/ unique id for wrapping content
						var td= $('<td id = "pic'+[k]+'">');

						//animal name
						var name = $('<p>' + petArray[k].name.$t + '</p>');	

						var breed = "";

							if($.isArray(petArray[k].breeds.breed)){
								var firstBreed = petArray[k].breeds.breed[0].$t;
								var secondBreed = petArray[k].breeds.breed[1].$t;
								breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
							} else{
								breed = $('<p> Breed: ' + petArray[k].breeds.breed.$t + '</p>');
							}


						var sex = $('<p> Sex: ' + petArray[k].sex.$t + '</p>');

						var age = $('<p> Age: ' + petArray[k].age.$t + '</p>');				
						 
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
						td.append(sex);
						td.append(age);
						$('#tr3').append(td);
											
					//closes 3rd for loop
					}

					//loop for last 5 objects to append to last <tr>
					for (var l = k; l < 20; l++) {
						
						//create new div for each animal w/ unique id for wrapping content
						var td= $('<td id = "pic'+[l]+'">');

						//animal name
						var name = $('<p id = "petname">' + petArray[l].name.$t + '</p>');

						var breed = "";

							if($.isArray(petArray[l].breeds.breed)){
								var firstBreed = petArray[l].breeds.breed[0].$t;
								var secondBreed = petArray[l].breeds.breed[1].$t;
								breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
							} else{
								breed = $('<p> Breed: ' + petArray[l].breeds.breed.$t + '</p>');
							}
					

						var sex = $('<p> Sex: ' + petArray[l].sex.$t + '</p>');

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
						td.append(sex);
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


				if (lastoffset === 20){

					var newBtn = $('<btn>').addClass('btn btn-primary last20').attr('id', 'toplast20').text('Display previous 20 results');
  					$('#buttondisplay').prepend(newBtn);
		  			var btmBtn = $('<btn>').addClass('btn btn-primary last20').attr('id', 'btmlast20').text('Display previous 20 results');
		  			$('#bottombuttons').prepend(btmBtn);

		  			$('.last20').on('click', function(){

		  				event.preventDefault();

		  				$('#displayrow').empty();

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
								var name = $('<p>' + petArray[i].name.$t + '</p>');	

								var breed = "";

									if($.isArray(petArray[i].breeds.breed)){
										var firstBreed = petArray[i].breeds.breed[0].$t;
										var secondBreed = petArray[i].breeds.breed[1].$t;
										breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
									} else{
										breed = $('<p> Breed: ' + petArray[i].breeds.breed.$t + '</p>');
									}
									

								var sex = $('<p> Sex: ' + petArray[i].sex.$t + '</p>');

								var age = $('<p> Age: ' + petArray[i].age.$t + '</p>');				
								 
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
								td.append(sex);
								td.append(age);
								$('#tr1').append(td);
													
							//closes 1st for loop
							}

							//loop for next 5 objects to append to second <tr>
							for (var j = i; j < 10; j++) {
								
								//create new div for each animal w/ unique id for wrapping content
								var td= $('<td id = "pic'+[j]+'">');

								//animal name
								var name = $('<p>' + petArray[j].name.$t + '</p>');	

								var breed = "";

									if($.isArray(petArray[j].breeds.breed)){
										var firstBreed = petArray[j].breeds.breed[0].$t;
										var secondBreed = petArray[j].breeds.breed[1].$t;
										breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
									} else{
										breed = $('<p> Breed: ' + petArray[j].breeds.breed.$t + '</p>');
									}
									

								var sex = $('<p> Sex: ' + petArray[j].sex.$t + '</p>');

								var age = $('<p> Age: ' + petArray[j].age.$t + '</p>');				
								 
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
								td.append(sex);
								td.append(age);
								$('#tr2').append(td);
													
							//closes 2nd for loop
							}

							//loop for 3rd 5 objects to append to 3rd <tr>
							for (var k = j; k < 15; k++) {
								
								//create new div for each animal w/ unique id for wrapping content
								var td= $('<td id = "pic'+[k]+'">');

								//animal name
								var name = $('<p>' + petArray[k].name.$t + '</p>');	

								var breed = "";

									if($.isArray(petArray[k].breeds.breed)){
										var firstBreed = petArray[k].breeds.breed[0].$t;
										var secondBreed = petArray[k].breeds.breed[1].$t;
										breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
									} else{
										breed = $('<p> Breed: ' + petArray[k].breeds.breed.$t + '</p>');
									}


								var sex = $('<p> Sex: ' + petArray[k].sex.$t + '</p>');

								var age = $('<p> Age: ' + petArray[k].age.$t + '</p>');				
								 
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
								td.append(sex);
								td.append(age);
								$('#tr3').append(td);
													
							//closes 3rd for loop
							}

							//loop for last 5 objects to append to last <tr>
							for (var l = k; l < 20; l++) {
								
								//create new div for each animal w/ unique id for wrapping content
								var td= $('<td id = "pic'+[l]+'">');

								//animal name
								var name = $('<p id = "petname">' + petArray[l].name.$t + '</p>');

								var breed = "";

									if($.isArray(petArray[l].breeds.breed)){
										var firstBreed = petArray[l].breeds.breed[0].$t;
										var secondBreed = petArray[l].breeds.breed[1].$t;
										breed = $("<p> Breeds: " + firstBreed + ", " + secondBreed + "</p>");							
									} else{
										breed = $('<p> Breed: ' + petArray[l].breeds.breed.$t + '</p>');
									}
							

								var sex = $('<p> Sex: ' + petArray[l].sex.$t + '</p>');

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
								td.append(sex);
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
									var newName = $('<p id="indname">'+response.petfinder.pet.name.$t+'</p>')
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

