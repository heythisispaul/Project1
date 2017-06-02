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
			$('#next10').remove();
			//clear the division of previous info
			$('#listanimals').empty();

			//zip code value
			var zipCode = $('#zipCode').val().trim();
			console.log(zipCode);
			localStorage.setItem("zipCode", zipCode)
			//animal type value
			var typeAnimal = $('#animaltype').val().trim();
			console.log(typeAnimal);
			localStorage.setItem("typeAnimal", typeAnimal);
			//offset=count to return next 10 results
			var lastoffset = 0;
			//url for ajax request w/ variables
			var queryURL = "http://api.petfinder.com/pet.find?format=json&key=dced171da3616db767dede0c93058383&callback=?&location="+zipCode+"&count=10&animal="+typeAnimal+"&output=full&offset="+ lastoffset;

			

			$.getJSON({
				url: queryURL,
				method: 'GET',
			}).done(function(response){

				console.log(response);

				//list of pets from response object
				var petArray = response.petfinder.pets.pet;
				console.log(petArray);



				for (var i = 0; i < petArray.length; i++) {
					
					//create new div for each animal
					var newDiv= $('<div>');
					//animal name
					var name = petArray[i].name.$t;
					
					 
					//picture of animal
					var pic = petArray[i].media.photos.photo[1].$t;
					//create new image with src = pic, and assigned attributes of animalid(unique identifier), and animalpic class
					var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[i].id.$t).attr('class', "animalpic");

					//append all info w/ <br>'s
					newDiv.append(name + "<br>");
					newDiv.append(animalPicture);
					
					
						
					//append newDiv to #listanimals on page
					$('#listanimals').append(newDiv);
										
				//closes for loop
				}


				$('#zipCode').val("");
				$('#animaltype').val("");

				//when user clicks on animal image
				$('img').on('click', function(){

					//create new button to go back
					var newBtn = $('<button>').attr('id', 'backbtn').text("Go Back").addClass('btn btn-primary');
					//append new button after search button
					$('#formbody').append(newBtn);

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

							var newDiv = $('<div>');
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

							//closes back button click event	
							})	

						//closes for loop
						}

						var newDiv = $('<div>');
						var description = $('<p id = "description">');
						description.text(response.petfinder.pet.description.$t);
						newDiv.append(description);

						$('#showanimal').append(newDiv);

					//closes promise		
					});

				//closes image click event	
				})
		

			//closes promise
			});


  			var newBtn = $('<btn>').addClass('btn btn-primary').attr('id', 'next10').text('Display next 10 results');
  			$('#formbody').append(newBtn);

  			$('#next10').on('click', function(){

  				event.preventDefault();

  				$('#listanimals').empty();

				//zip code value
				var zipCode = localStorage.getItem("zipCode");
				console.log(zipCode);
				//animal type value
				var typeAnimal = localStorage.getItem("typeAnimal");
				console.log(typeAnimal);
				//offset=count to return next 10 results
				lastoffset = lastoffset + 10;
				console.log(lastoffset);
				//url for ajax request w/ variables
				var queryURL = "http://api.petfinder.com/pet.find?format=json&key=dced171da3616db767dede0c93058383&callback=?&location="+zipCode+"&count=10&animal="+typeAnimal+"&output=full&offset="+ lastoffset;

				$.getJSON({
					url: queryURL,
					method: 'GET',
				}).done(function(response){
					console.log(response);

					//list of pets from response object
					var petArray = response.petfinder.pets.pet;
					console.log(petArray);



					for (var i = 0; i < petArray.length; i++) {
						
						//create new div for each animal
						var newDiv= $('<div>');
						//animal name
						var name = petArray[i].name.$t;
						//picture of animal
						var pic = petArray[i].media.photos.photo[1].$t;
						//create new image with src = pic, and assigned attributes of animalid(unique identifier), and animalpic class
						var animalPicture = $('<img>').attr('src', pic).attr('animalId', petArray[i].id.$t).attr('class', "animalpic");

						//append all info w/ <br>'s
						newDiv.append(name + "<br>");
						newDiv.append(animalPicture);
							
						//append newDiv to #listanimals on page
						$('#listanimals').append(newDiv);
											
					//closes for loop
					}

					

					//when user clicks on animal image
					$('img').on('click', function(){

						//create new button to go back
						var newBtn = $('<button>').attr('id', 'backbtn').text("Go Back").addClass('btn btn-primary');
						//append new button after search button
						$('#formbody').append(newBtn);

						//hide search results div and show pictures of animal
						$('#initialdisplay').hide();
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

//------------------------------------------Insert google maps api here------------------------------------------------------------------

								var newDiv = $('<div>');
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

								//closes back button click event	
								})	

							//closes for loop
							}

							var newDiv = $('<div>');
							var description = $('<p id = "description">');
							description.text(response.petfinder.pet.description.$t);
							newDiv.append(description);

							$('#showanimal').append(newDiv);

						//closes promise		
						});

					//closes image click event	
					})
			

				//closes promise
				});

			//closesdisplay next 10 results
  			})

		//closing tags for search button click event
		});