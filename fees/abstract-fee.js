define([
	'knockout'
], function (ko) {
	var AbstractFee = function(params) {
		this.app = params.app || null;
		this.name = "";
		this.requiresInput = false;
		
		this.triggered = ko.computed(function () {
			return true;
		});
		
		this.ready = ko.computed(function () {
			return !this.requiresInput;
		});
		
		this.calculatedFee = ko.computed(function () {
			return 0;
		});
		
		this.json = ko.computed(function () {
			return {};
		});
	};
	return AbstractFee;
});