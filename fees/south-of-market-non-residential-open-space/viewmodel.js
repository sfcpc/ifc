define([
    'knockout',
    'fees/abstract-fee',
    'json!./settings.json',
    './component'
], function(ko, AbstractFee, settings) {
    var somaNonResOpenSpace = function(params) {
        this.settings = settings;

        AbstractFee.apply(this, [params]);

        this.triggered = ko.computed(function() {
			return this.isProjectInArea() &&
				(
					this.newNonRes() >= this.minNewNonResGSF ||
					this.nonResGSF() >= this.minNetNonResGSF
				);
		}, this);

        this.ready = ko.computed(function() {
            return true;
        }, this);

        this.calculatedFee = ko.computed(function() {
            return 0;
        }, this);
    };

    somaNonResOpenSpace.settings = settings;

    return somaNonResOpenSpace;
});
