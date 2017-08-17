define([
	'knockout'
], function (ko) {
	var AbstractFee = function(params) {
		this.app = params.app || null;
		this.feeTypeName = "";
		this.label = "";
		this.requiresInput = false;
		
		this.triggered = ko.computed(function () {
			return true;
		}, this);
		
		this.ready = ko.computed(function () {
			if (!this.triggered()) {
				return true;
			}
			return !this.requiresInput;
		}, this);
		
		this.calculatedFee = ko.computed(function () {
			return 0;
		}, this);
		
		this.json = ko.computed(function () {
			return {};
		}, this);
	};
	return AbstractFee;
});