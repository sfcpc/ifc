define([
	'json!settings.json'
], function (settings) {
	var app = {
		init: function () {
			console.log(settings.hello);
		}
	};
	return app;
});