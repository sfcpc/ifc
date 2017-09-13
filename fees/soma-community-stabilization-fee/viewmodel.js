define([
	'knockout',
	'fees/abstract-fee',
	'json!./settings.json',
	'./component'
], function(ko, AbstractFee, settings) {
	var SomaCommunityStabilizationFee = function(params) {
		var self = this;
        this.settings = settings;

		AbstractFee.apply(this, [params]);

		this.triggered = this.isProjectInArea;

		this.ready = ko.computed(function() {
			return true;
		}, this);

		this.calculatedFee = ko.computed(function() {
			return 0;
		}, this);
	};

	SomaCommunityStabilizationFee.name = settings.name;

	return SomaCommunityStabilizationFee;
});
