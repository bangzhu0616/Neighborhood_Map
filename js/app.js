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
		var oauth = '&limit=20&oauth_token=HUQKWZ2KCYLF52D3ZZ1JTVLGML2WVYMCPBSE0LERJZBL5AIC&v=20150119';
		var url = url0+'near='+city+','+state+'&section='+section+oauth;
		var $placesHeader = $('#foursquare-header');
		var $placesElem = $('#foursquare-places');

		$placesHeader.text("");
		$placesElem.text("")

		$.getJSON(url, function(data){
			console.log('sdfdsf');
			$placesHeader.text('foursquare '+section+' found in '+city+', '+state+': ');
			var places = data.response.groups[0].items;
			for (var i=0; i<places.length; i++) {
				var place = places[i];
				$placesElem.append('<li class="place"><a href="'+place.venue.url+'">'+place.venue.name+'</a>,'+place.venue.categories[0].name+'<p>'+place.tips[0].text+'</p></li>');
			}
		}).error(function(){
			$placesHeader.text('foursquare places could not loaded.')
		});
	};
};

ko.applyBindings(new ViewModel());