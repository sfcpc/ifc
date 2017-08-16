define(['json!settings.json'], function (settings) {
	return {
		init: function () {
			console.log(settings.hello);
		}
	};
});