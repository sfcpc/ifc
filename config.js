define([], function () {    
    require.config({
        paths: {
            "livereload": "http://localhost:35729/livereload"
        }
    });
    if (window.location.origin === "file://") {
        try {
            require(['livereload']);
        }  catch (e) {
            console.log('cannot load livereload.')
        }
    }
});