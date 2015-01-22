
var locations_found =[];
var url0 = 'https://api.foursquare.com/v2/venues/explore?';
var oauth = '&limit=10&oauth_token=HUQKWZ2KCYLF52D3ZZ1JTVLGML2WVYMCPBSE0LERJZBL5AIC&v=20150119';

var addMarkers = function(){
	var self = this;
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
				zoom: 4,
				center: google.maps.LatLng(40.766511,-111.842214)
			});
	this.bounds = new google.maps.LatLngBounds();
	locations_found.forEach(function(loc){
		var myLatlng = new google.maps.LatLng(loc.lat, loc.lng);
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: loc.name
		});
		var infowindow = null;
		google.maps.event.addListener(marker, 'click', function(){
			infowindow = new google.maps.InfoWindow({
				content: loc.content
			});
			infowindow.open(map, marker);
		});
		self.bounds.extend(myLatlng);
	});
	map.fitBounds(this.bounds);
};

var addFours = function(pre){
	pre.fourlist(locations_found);
};

var ViewModel = function() {
	var self = this;

	this.cityInput = ko.observable('');
	this.stateInput = ko.observable('');
	this.sectionInput = ko.observable('');
	this.fourhead = ko.observable('');
	this.fourlist = ko.observableArray([]);
	this.greeting = ko.observable('');

	this.keysearch = function() {
		var city = self.cityInput();
		var state  = self.stateInput();
		var section = self.sectionInput();
		var url = url0+'near='+city+','+state+'&section='+section+oauth;
		
		locations_found = [];
		self.fourhead('');
		self.fourlist([]);

		$.getJSON(url, function(data){
			self.greeting('Found places for you');
			//self.fourhead('foursquare '+section+' found in '+city+' '+state);
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

		}).error(function(){
			self.greeting('Can not find places for you. Input error!');
			$('#map-canvas').html('');
		});

	};

};

ko.applyBindings(new ViewModel());



