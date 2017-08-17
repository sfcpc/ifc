define([
	'knockout'
], function (ko) {
	var App = function(params) {
		this.name = params.name || "";
		this.loading = ko.observable(false);
	};
	return App;
});
