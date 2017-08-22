define([
	'knockout'
], function (ko) {
	var AbstractFee = function(params) {
		this.app = params.app || null;
		this.label = "";
		this.requiresInput = false;
		this.feeTypeName = AbstractFee.feeTypeName;
		
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
	
	AbstractFee.feeTypeName = "";
	return AbstractFee;
});