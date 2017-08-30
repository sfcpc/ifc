require.config({
	paths: {
		"jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min",
		"popper": "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min",
		"bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min",
		"underscore": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
		"knockout": "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min",
		"openlayers": "https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.3.1/ol",
		"turf": "https://cdnjs.cloudflare.com/ajax/libs/Turf.js/4.6.1/turf.min",
		"text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
		"json": "https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/json.min",
	},
	shim: {
		"popper": {
			deps: ["jquery"],
			exports: "Popper"
		},
		"bootstrap": {
			deps: ["jquery", "popper-wrap"]
		}
	}
});

define('popper-wrap', ['popper'], function(popper) {
	window.Popper = popper;
});

requirejs([
	"knockout",
	"underscore",
	'app',
	"json!settings.json",
	"bootstrap",
	"bindings/numeric-text",
	"bindings/ol-map"
], function(ko, _, App, settings) {
	if (window.location.hostname === "localhost") {
		require(['http://localhost:' + settings.livereloadPort + '/livereload.js'],
			function() {
				console.log('livereload connected');
			},
			function(e) {
				console.warn('Failed to load livereload. If you\'re using Atom, try this Atom package: https://atom.io/packages/livereload');
			}
		);
	}
	require(_.map(settings.feeTypes, function(feeTypeName) {
		return 'fees/' + feeTypeName + '/viewmodel'
	}), function() {
		var params = _.chain(decodeURIComponent(location.search).slice(1).split('&'))
			.map(function(item) {
				if (item) return item.split('=');
			})
			.compact()
			.object()
			.value();

		var app = new App(
			_.extend(params, {
				name: settings.appName
			})
		);
		var feeParams = params.fees ? JSON.parse(params.fees) : {};
		var feeViewModels = _.map(arguments, function(feeViewModel) {
			var feeQuery = feeParams[feeViewModel.feeTypeName] || {};
			return new feeViewModel(
				_.extend(feeQuery, {
					app: app
				})
			);
		});
		app.feeViewModels(feeViewModels);
		ko.applyBindings(app);

		app.queryString.subscribe(function(queryString) {
			window.history.pushState({}, '', queryString);
		});

		window.onpopstate = function() {
			window.location.reload();
		};
	})
});
