define([
	'json!settings.json'
], function (settings) {
	var App = function() {
		this.hello = "Hello World!";
	};
	return App;
});