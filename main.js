require.config({
    paths: {
        "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min",
        "underscore": "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
        "knockout": "https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.2/knockout-min",
        "openlayers": "https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.3.1/ol",
        "json": "https://cdnjs.cloudflare.com/ajax/libs/requirejs-plugins/1.0.3/json.min",
        "text": "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min",
        "livereload": "http://localhost:35729/livereload"
    }
});

requirejs(["json"], function() {
    if (window.location.hostname === "localhost") {
        require(['livereload'],
            function () {},
            function (e) {
                console.warn('Failed to load livereload. Try using this Atom package: https://atom.io/packages/livereload');
            }
        );
    }
    require(['app'], function (app) {
        app.init();
    });
});
