var ViewModel = function() {
	var self = this;

	this.cityInput = ko.observable('');
	this.placeInput = ko.observable('');
	this.sectionInput = ko.observable('');

	this.keysearch = function() {
		console.log(self.cityInput());
		console.log(self.placeInput());
		console.log(self.sectionInput());
	};
};

ko.applyBindings(new ViewModel());