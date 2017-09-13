define([
	'knockout',
	'fees/abstract-fee',
	'json!./settings.json',
	'./component'
], function(ko, AbstractFee, settings) {
	var MockFee = function(params) {
        this.paramNames = [
            'value',
            'netNewUnits'
        ];

		AbstractFee.apply(this, [params]);

		this.feeTypeName = settings.name;
		this.label = settings.label;
		this.multiplier = settings.multiplier;

		this.triggered = ko.computed(function() {
			return this.netNewUnits() >= settings.minNetNewUnits;
		}, this);

		this.ready = ko.computed(function() {
			if (!this.triggered()) {
				return true;
			}
			return this.value();
		}, this);

		this.calculatedFee = ko.computed(function() {
			var val = this.value();
			return val && this.triggered() ? val * this.multiplier : 0;
		}, this);

		this.json = ko.computed(function() {
			return {
				"value": this.value()
			};
		}, this);
	};

	MockFee.feeTypeName = settings.name;

	return MockFee;
});
