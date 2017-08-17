define([
	'knockout'
], function (ko) {
	var AbstractComponent = function(params) {
		this.fee = params.fee;
		this.state = params.state || 'form';
	};
	return AbstractComponent;
});