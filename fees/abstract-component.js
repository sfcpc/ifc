define([
	'knockout'
], function (ko) {
	var AbstractComponent = function(params) {
		this.fee = params.fee;
		console.log(this.fee);
		console.log(params.fee.value());
		this.state = params.state || 'form';
	};
	return AbstractComponent;
});