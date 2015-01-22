function addMarker(curmap, name, latlng, string){
	this.name = name;
	this.latlng = latlng;
	var marker = new google.maps.Marker({
					position: latlng,
					map: curmap,
					title: name
				}); 
	var infowindow = null;
	google.maps.event.addListener(marker, 'click', function(){
		infowindow = new google.maps.InfoWindow({
			content: string
		});
		infowindow.open(curmap,marker);
	});
}

var locations_found =[];

var ViewModel = function() {
	var self = this;

	this.cityInput = ko.observable('');
	this.stateInput = ko.observable('');
	this.sectionInput = ko.observable('');

	this.keysearch = function() {
		var city = self.cityInput();
		var state  = self.stateInput();
		var section = self.sectionInput();
		var url0 = 'https://api.foursquare.com/v2/venues/explore?';
		var oauth = '&limit=10&oauth_token=HUQKWZ2KCYLF52D3ZZ1JTVLGML2WVYMCPBSE0LERJZBL5AIC&v=20150119';
		var url = url0+'near='+city+','+state+'&section='+section+oauth;
		var $placesHeader = $('#foursquare-header');
		var $placesElem = $('#foursquare-places');

		$placesHeader.text("");
		$placesElem.text("");
		locations_found = [];

		$.getJSON(url, function(data){
			$placesHeader.text('foursquare '+section+' found in '+city+', '+state+': ');
			var places = data.response.groups[0].items;
			for (var i=0; i<places.length; i++) {
				var place = places[i];
				$placesElem.append('<li class="place"><a href="'+place.venue.url+'">'+place.venue.name+'</a>,'+place.venue.categories[0].name+'<p>'+place.tips[0].text+'</p></li>');
				locations_found.push({
					name: place.venue.name,
					cat: place.venue.categories[0].name,
					url: place.venue.url,
					text: place.tips[0].text,
					lat: place.venue.location.lat,
					lng: place.venue.location.lng
				});
			}

			var map = new google.maps.Map(document.getElementById('map-canvas'), {
				zoom: 4,
				center: google.maps.LatLng(40.766511,-111.842214)
			});

			var bounds = new google.maps.LatLngBounds();
			for (var i=0; i<locations_found.length; i++){
				var loc = locations_found[i];
				var myLatlng = new google.maps.LatLng(loc.lat, loc.lng);
				var contentString = loc.name+', '+loc.cat+'<hr>'+'<a href="'+loc.url+'">'+loc.name+'</a>'
				new addMarker(map, loc.name, myLatlng, contentString)
				bounds.extend(myLatlng);
			}
			map.fitBounds(bounds);

		}).error(function(){
			$placesHeader.text('foursquare places could not loaded.')
		});

	};

};

vm = new ViewModel();
ko.applyBindings(vm);



