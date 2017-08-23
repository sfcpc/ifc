define([
	'knockout'
], function(ko) {
	var AbstractComponent = function(params) {
        // the fee viewmodel
		this.fee = params.fee;

        // a string indicating component state; 'form' or 'report'
		this.state = params.state || 'form';
	};
	return AbstractComponent;
});
