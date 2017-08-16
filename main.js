requirejs(['config'], function() {
	if (window.location.origin === "file://") {
		require(['livereload']);
	}
    console.log('Hello World');
});