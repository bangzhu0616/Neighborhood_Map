// locations_found: an array of 10 locations found in foursquare database based on user's input
// Model
var locations_found =[];
// url0: use foursquare explore api
var url0 = 'https://api.foursquare.com/v2/venues/explore?';
var oauth = '&limit=10&oauth_token=HUQKWZ2KCYLF52D3ZZ1JTVLGML2WVYMCPBSE0LERJZBL5AIC&v=20150119';

// Add locations as markers on a google map
// View
var addMarkers = function(){
	var self = this;
	// create a google map
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
				zoom: 4,
				center: google.maps.LatLng(40.766511,-111.842214)
			});
	// set the bound of this google map
	this.bounds = new google.maps.LatLngBounds();
	// for each location set a marker
	locations_found.forEach(function(loc){
		var myLatlng = new google.maps.LatLng(loc.lat, loc.lng);
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: loc.name
		});
		var infowindow = null;
		// when click a marker, pop a window to show some information
		google.maps.event.addListener(marker, 'click', function(){
			infowindow = new google.maps.InfoWindow({
				content: loc.content
			});
			infowindow.open(map, marker);
		});
		self.bounds.extend(myLatlng);
	});
	// fit the bound
	map.fitBounds(this.bounds);
};

// add foursquare locations in fourlist and render them to the page
// View
var addFours = function(pre){
	pre.fourlist(locations_found);
};

//ViewModel
var ViewModel = function() {
	var self = this;

	// all the variables connect js file and html file
	this.cityInput = ko.observable('');
	this.stateInput = ko.observable('');
	this.sectionInput = ko.observable('');
	this.fourhead = ko.observable('');
	this.fourlist = ko.observableArray([]);
	this.greeting = ko.observable('');

	// start search
	this.keysearch = function() {
		// get user's input
		var city = self.cityInput();
		var state  = self.stateInput();
		var section = self.sectionInput();
		// generate the foursquare api url
		var url = url0+'near='+city+','+state+'&section='+section+oauth;
		
		// clear the last search data
		locations_found = [];
		self.fourhead('');
		self.fourlist([]);

		// get json data from foursquare api
		$.getJSON(url, function(data){
			self.greeting('Found places for you');
			var places = data.response.groups[0].items;
			for (var i=0; i<places.length; i++) {
				var place = places[i];
				locations_found.push({
					name: place.venue.name,
					cat: place.venue.categories[0].name,
					url: place.venue.url,
					text: place.tips[0].text,
					lat: place.venue.location.lat,
					lng: place.venue.location.lng,
					content: place.venue.name+', '+place.venue.categories[0].name+'<hr>'+'<a href="'+place.venue.url+'">'+place.venue.name+'</a>',
					four: '<a href="'+place.venue.url+'">'+place.venue.name+'</a>,'+place.venue.categories[0].name+'<p>'+place.tips[0].text+'</p>'
				});
			}

			addMarkers();
			addFours(self);
		// render an error message when can not get json data
		}).error(function(){
			self.greeting('Can not find places for you. Input error!');
			$('#map-canvas').html('');
		});

	};

};

ko.applyBindings(new ViewModel());



