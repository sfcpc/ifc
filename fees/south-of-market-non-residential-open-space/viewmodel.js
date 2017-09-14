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

    somaNonResOpenSpace.feeTypeName = settings.name;

    return somaNonResOpenSpace;
});
