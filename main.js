requirejs(['config'], function() {
	if (window.location.origin === "file://") {
		try {
			require(['livereload']);
		}  catch (e) {
			console.log('cannot load livereload.')
		}
	}
    console.log('Hello World');
});