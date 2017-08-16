require.config({
    paths: {
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min",
        "underscore": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
        "knockout": "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min",
        "openlayers": "https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.3.1/ol",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        "json": "https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/json.min"
    }
});

requirejs([
    "knockout",
    "json!settings.json"
], function(ko, settings) {
    if (window.location.hostname === "localhost") {
        require(['http://localhost:' + settings.livereloadPort +'/livereload.js'],
            function () {
                console.log('livereload connected');
            },
            function (e) {
                console.warn('Failed to load livereload. Try using this Atom package: https://atom.io/packages/livereload');
            }
        );
    }
    require(['app'], function (App) {
        var app = new App();
        ko.applyBindings(app);
    });
});
